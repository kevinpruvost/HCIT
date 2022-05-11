import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import TravelScreen from './TravelScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <TravelScreen />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerstyle: {
    height: 25
  }
});