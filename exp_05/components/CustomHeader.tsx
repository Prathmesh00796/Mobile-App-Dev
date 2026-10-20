import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function CustomHeader({title}: any) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'blue',
    padding: 20,
    alignItems: 'center',
  },

  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
});