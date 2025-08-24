import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import CardItem from '../../components/CardItem';
import SwipeableCard from '../../components/SwipeableCard';

const MOCK_DATA = [
  { id: 1, title: 'Brown', image: require('../../assets/images/mock-image-1.jpg') },
  { id: 2, title: 'Mint green', image: require('../../assets/images/mock-image-2.jpg') },
  { id: 3, title: 'Black', image: require('../../assets/images/mock-image-3.jpg') },
  { id: 4, title: 'Dark khaki green', image: require('../../assets/images/mock-image-4.jpg') },
  { id: 5, title: 'White', image: require('../../assets/images/mock-image-5.jpg') },
];

export default function HomeScreen() {
  const [cards, setCards] = useState(MOCK_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeCardTranslateX = useSharedValue(0);
  const activeCardTranslateY = useSharedValue(0);
  const nextCardScale = useSharedValue(0.9);
  const nextCardTranslateY = useSharedValue(20);

  const onSwipe = useCallback(() => {
    // animate next card into place
    nextCardScale.value = withTiming(1, { duration: 380, easing: Easing.out(Easing.ease) });
    nextCardTranslateY.value = withTiming(0, { duration: 380, easing: Easing.out(Easing.ease) });

    // advance index immediately (so React knows to render next card)
    setCurrentIndex((i) => i + 1);

    // reset values for the following card
    nextCardScale.value = 0.9;
    nextCardTranslateY.value = 20;
    activeCardTranslateX.value = 0;
    activeCardTranslateY.value = 0;
  }, [activeCardTranslateX, activeCardTranslateY, nextCardScale, nextCardTranslateY]);

  const handleReload = () => {
    setCards(MOCK_DATA);
    setCurrentIndex(0);
    activeCardTranslateX.value = 0;
    activeCardTranslateY.value = 0;
    nextCardScale.value = 0.9;
    nextCardTranslateY.value = 20;
  };

  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: nextCardScale.value },
      { translateY: nextCardTranslateY.value },
    ],
  }));

  const isDeckEmpty = currentIndex >= cards.length;

  return (
    <LinearGradient
      colors={['#FBEAE7', '#F5C6AA']}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.cardStack}>
          {isDeckEmpty ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>You're all caught up!</Text>
              <TouchableOpacity style={styles.fab} onPress={handleReload}>
                <Text style={styles.iconText}>⟲</Text>
              </TouchableOpacity>
            </View>
          ) : (
            cards
              .map((item, index) => {
                if (index < currentIndex) return null;
                if (index > currentIndex + 1) return null;

                if (index === currentIndex + 1) {
                  return (
                    <Animated.View
                      key={item.id}
                      style={[StyleSheet.absoluteFill, styles.cardContainer, nextCardStyle]}
                      pointerEvents="none"
                    >
                      <CardItem title={item.title} image={item.image} />
                    </Animated.View>
                  );
                }

                if (index === currentIndex) {
                  return (
                    <SwipeableCard
                      key={item.id}
                      item={item}
                      onSwipe={onSwipe}
                      activeCardTranslateX={activeCardTranslateX}
                      activeCardTranslateY={activeCardTranslateY}
                    />
                  );
                }
              })
              .reverse()
          )}
        </View>

        <View style={styles.footer} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: { flex: 1 },
  container: { flex: 1 },
  cardStack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 22,
    marginTop: 50,
    marginBottom: 10,
  },
  cardContainer: { width: '100%', height: '100%' },
  footer: { height: 80, justifyContent: 'center', alignItems: 'center' },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#5A2A27',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F5C6AA',
    marginTop: 20,
  },
  iconText: {
    color: '#FFF5EE',
    fontSize: 38,
    fontWeight: 'bold',
    textShadowColor: '#FFDAB9',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    lineHeight: 38,
    textAlign: 'center',
    marginTop: -8,
    marginLeft: -2,
  },
  emptyStateContainer: { 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#5A2A27',
    textShadowColor: '#FFDAB9',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
