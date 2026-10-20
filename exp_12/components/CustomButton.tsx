import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return '#CBD5E1';
    switch (variant) {
      case 'secondary':
        return theme.colors.secondary;
      case 'danger':
        return theme.colors.danger;
      case 'success':
        return theme.colors.success;
      case 'outline':
        return 'transparent';
      case 'primary':
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return '#94A3B8';
    if (variant === 'outline') return theme.colors.primary;
    return theme.colors.white;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          paddingVertical: size === 'small' ? 8 : size === 'large' ? 14 : 11,
          paddingHorizontal: size === 'small' ? 12 : 18,
          borderColor: variant === 'outline' ? theme.colors.primary : 'transparent',
          borderWidth: variant === 'outline' ? 1.5 : 0,
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: size === 'small' ? 12 : size === 'large' ? 16 : 14,
            },
            textStyle,
          ]}
        >
          {icon ? `${icon} ` : ''}
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.7,
  },
});

export default CustomButton;
