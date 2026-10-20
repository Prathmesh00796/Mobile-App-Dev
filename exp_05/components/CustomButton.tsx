import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  color = '#2563EB',
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: color },
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    height: 46,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});