import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>
        <HomeScreen />
      </View>
    </SafeAreaView>
  );
}
