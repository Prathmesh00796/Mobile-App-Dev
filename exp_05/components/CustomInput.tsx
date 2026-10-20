import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

export default function CustomInput({
  label,
  value,
  onChangeText,
  placeholder,
}: any) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
});