import LottieView from 'lottie-react-native';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import CardItem from './CardItem';

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);
const { width: screenWidth } = Dimensions.get('window');

const SWIPE_THRESHOLD = screenWidth * 0.3;
const VELOCITY_THRESHOLD = 400;
const EXIT_DURATION = 240;
const SNAP_BACK_DURATION = 150;

type SwipeableCardProps = {
  item: { id: number; title: string; image: any };
  onSwipe: () => void;
  activeCardTranslateX: Animated.SharedValue<number>;
  activeCardTranslateY: Animated.SharedValue<number>;
};

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  item,
  onSwipe,
  activeCardTranslateX,
  activeCardTranslateY,
}) => {
  const gesture = Gesture.Pan()
    .activeOffsetX([-8, 8])
    .onUpdate((e) => {
      activeCardTranslateX.value = e.translationX;
      activeCardTranslateY.value = e.translationY;
    })
    .onEnd((e) => {
      const x = activeCardTranslateX.value;
      const vx = e.velocityX;
      const shouldSwipe =
        Math.abs(vx) > VELOCITY_THRESHOLD || Math.abs(x) > SWIPE_THRESHOLD;

      if (shouldSwipe) {
        const toRight = x > 0;
        activeCardTranslateX.value = withTiming(
          toRight ? screenWidth * 1.5 : -screenWidth * 1.5,
          { duration: EXIT_DURATION },
          () => {
            activeCardTranslateX.value = 0;
            activeCardTranslateY.value = 0;
          }
        );
        runOnJS(onSwipe)();
      } else {
        activeCardTranslateX.value = withTiming(0, { duration: SNAP_BACK_DURATION });
        activeCardTranslateY.value = withTiming(0, { duration: SNAP_BACK_DURATION });
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      activeCardTranslateX.value,
      [-screenWidth, screenWidth],
      [-20, 20]
    );
    return {
      transform: [
        { translateX: activeCardTranslateX.value },
        { translateY: activeCardTranslateY.value },
        { rotate: `${rotation}deg` },
      ],
    };
  });

  // ✅ Animated progress + opacity for check
  const checkAnimatedProps = useAnimatedProps(() => ({
    progress: interpolate(activeCardTranslateX.value, [20, SWIPE_THRESHOLD], [0, 1], Extrapolate.CLAMP),
    opacity: interpolate(activeCardTranslateX.value, [20, SWIPE_THRESHOLD], [0, 1], Extrapolate.CLAMP),
  }));

  const crossAnimatedProps = useAnimatedProps(() => ({
    progress: interpolate(activeCardTranslateX.value, [-SWIPE_THRESHOLD, -20], [1, 0], Extrapolate.CLAMP),
    opacity: interpolate(activeCardTranslateX.value, [-SWIPE_THRESHOLD, -20], [1, 0], Extrapolate.CLAMP),
  }));

  // ✅ Add scaling to checkmark
  const checkScaleStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      activeCardTranslateX.value,
      [0, SWIPE_THRESHOLD],
      [1, 1.8], // bigger as swipe progresses
      Extrapolate.CLAMP
    );
    return { transform: [{ scale }] };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedCardStyle]}>
        {/* ❌ Cross (left) */}
        <AnimatedLottieView
          source={require('../assets/lottie/cross.json')}
          style={styles.lottieIconLeft}
          animatedProps={crossAnimatedProps}
          loop={false}
        />

        {/* ✅ Check (right, centered, scaling) */}
        <Animated.View style={[styles.lottieCheckWrapper, checkScaleStyle]}>
          <AnimatedLottieView
            source={require('../assets/lottie/checkmark.json')}
            style={styles.lottieCheck}
            animatedProps={checkAnimatedProps}
            loop={false}
          />
        </Animated.View>

        <CardItem title={item.title} image={item.image} />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  lottieIconLeft: {
    position: 'absolute',
    top: '15%',
    left: '10%',
    width: 150,
    height: 150,
    zIndex: 10,
    transform: [{ rotate: '20deg' }],
  },
  // ✅ Wrapper to center check
  lottieCheckWrapper: {
    position: 'absolute',
    top: '30%',   // center-ish vertically
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 15,
  },
  lottieCheck: {
    width: 180,
    height: 180,
  },
});

export default SwipeableCard;
