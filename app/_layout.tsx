import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)" // This points to the app/(tabs) directory
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}