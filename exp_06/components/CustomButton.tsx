import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, FONT_SIZES, RADIUS, SPACING, SHADOWS } from '../theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
  primaryColor?: string; // Optional dynamic override
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  primaryColor,
}) => {
  const activePrimary = primaryColor || COLORS.primary;

  const getContainerStyle = (): ViewStyle => {
    // Size adjustments
    let height = 48;
    let paddingHorizontal = SPACING.lg;
    if (size === 'sm') {
      height = 36;
      paddingHorizontal = SPACING.md;
    } else if (size === 'lg') {
      height = 54;
      paddingHorizontal = SPACING.xl;
    }

    // Variant adjustments
    switch (variant) {
      case 'secondary':
        return {
          height,
          paddingHorizontal,
          backgroundColor: COLORS.surfaceSubtle,
          borderWidth: 1,
          borderColor: COLORS.border,
        };
      case 'outline':
        return {
          height,
          paddingHorizontal,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: activePrimary,
        };
      case 'danger':
        return {
          height,
          paddingHorizontal,
          backgroundColor: COLORS.danger,
        };
      case 'primary':
      default:
        return {
          height,
          paddingHorizontal,
          backgroundColor: activePrimary,
          ...SHADOWS.button,
          shadowColor: activePrimary,
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'secondary':
        return { color: COLORS.text, fontSize: size === 'sm' ? FONT_SIZES.sm : FONT_SIZES.md };
      case 'outline':
        return { color: activePrimary, fontSize: size === 'sm' ? FONT_SIZES.sm : FONT_SIZES.md };
      case 'danger':
      case 'primary':
      default:
        return { color: COLORS.textInverse, fontSize: size === 'sm' ? FONT_SIZES.sm : FONT_SIZES.md };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.buttonBase,
        getContainerStyle(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'secondary' ? activePrimary : COLORS.textInverse}
        />
      ) : (
        <Text style={[styles.textBase, getTextStyle()]}>
          {icon ? `${icon}  ` : ''}
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: RADIUS.sm + 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: SPACING.xs,
  },
  textBase: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.55,
  },
});
