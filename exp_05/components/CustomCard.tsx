import React from 'react';
import {
  View,
  StyleSheet,
  ViewProps,
} from 'react-native';

interface CustomCardProps extends ViewProps {
  children: React.ReactNode;
}

const CustomCard: React.FC<CustomCardProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <View
      {...props}
      style={[styles.card, style]}
    >
      {children}
    </View>
  );
};

export default CustomCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 15,

    elevation: 4,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});