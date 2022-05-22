import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Page from './Page';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Page />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerstyle: {
    height: 25
  }
});