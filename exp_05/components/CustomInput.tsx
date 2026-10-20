import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
}) => {
  return (
    <View style={styles.container}>

      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />

    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },

  input: {
    height: 47,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 9,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#111827',
  },
});