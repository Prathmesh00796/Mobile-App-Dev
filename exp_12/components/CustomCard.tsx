import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { theme } from '../theme';

interface CustomCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export const CustomCard: React.FC<CustomCardProps> = ({
  children,
  onPress,
  style,
}) => {
  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[styles.card, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
    marginBottom: theme.spacing.md,
  },
});

export default CustomCard;
