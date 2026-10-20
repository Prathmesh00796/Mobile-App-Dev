import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to React Native</Text>
      <Text>Experiment E01</Text>
      <Text>Project Structure and Emulator</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});