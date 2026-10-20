import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export default function CustomButton({title, onPress}: any) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}>

      <Text style={styles.text}>{title}</Text>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 8,
  },

  text: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});