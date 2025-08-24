import { Tabs } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabLayout() {
  return (
    // THIS IS THE MOST IMPORTANT FIX.
    // The GestureHandlerRootView MUST wrap the navigator for gestures to work reliably.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarStyle: { display: 'none' }, // Hides the bottom tab bar
          headerShown: false, // Hides the top header
        }}
      >
        <Tabs.Screen name="index" />
      </Tabs>
    </GestureHandlerRootView>
  );
}