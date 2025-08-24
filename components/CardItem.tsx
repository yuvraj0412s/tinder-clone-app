import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

// Theme colors
const TEXT_COLOR = '#fff8f3ff';   // soft ivory-peach
const GLOW_COLOR = '#ffb472ff';   // warm peach glow
const BORDER_COLOR = '#703b39ff'; // ✨ muted peach-maroon (eye soothing)

interface CardItemProps {
  image: ImageSourcePropType;
  title: string;
}

const CardItem: React.FC<CardItemProps> = ({ image, title }) => {
  const textTranslateY = useSharedValue(0);

  useEffect(() => {
    textTranslateY.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(2, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [textTranslateY]);

  const animatedTextStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: textTranslateY.value }] };
  });

  return (
    <View style={styles.outerCard}>
      {/* Inner image container */}
      <View style={styles.innerCard}>
        <Image source={image} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={styles.textOverlay}
        />
      </View>

      {/* Bottom bar: only Title now */}
      <View style={styles.bottomBar}>
        <Animated.View style={[animatedTextStyle]}>
          <Text style={styles.titleText}>{title}</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerCard: {
    flex: 1,
    borderRadius: 32,
    backgroundColor: BORDER_COLOR, 
    padding: 10,                   
    paddingBottom: 36,             
    justifyContent: 'flex-end',    
  },
  innerCard: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FBEAE7',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // 👈 only title on left
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: TEXT_COLOR,
    textShadowColor: GLOW_COLOR,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginTop: 4,
  },
});

export default CardItem;
