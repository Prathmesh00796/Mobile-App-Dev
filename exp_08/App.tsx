import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import NotesScreen from './NotesScreen';

interface Exp8Props {
  onBackToLab?: () => void;
}

export default function App({ onBackToLab }: Exp8Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1E3A8A" barStyle="light-content" />
      <NotesScreen onBackToLab={onBackToLab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
});
