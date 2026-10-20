import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import ApiDemoScreen from './ApiDemoScreen';

interface Exp9Props {
  onBackToLab?: () => void;
}

export default function App({ onBackToLab }: Exp9Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0F172A" barStyle="light-content" />
      <ApiDemoScreen onBackToLab={onBackToLab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
