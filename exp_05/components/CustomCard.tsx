import React from 'react';
import {View, StyleSheet} from 'react-native';

export default function CustomCard({children}: any) {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 15,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
});