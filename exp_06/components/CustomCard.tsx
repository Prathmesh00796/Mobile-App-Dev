import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS, FONT_SIZES } from '../theme';

interface CustomCardProps extends ViewProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'flat';
  style?: ViewStyle | ViewStyle[];
}

const CustomCard: React.FC<CustomCardProps> = ({
  title,
  subtitle,
  children,
  variant = 'elevated',
  style,
  ...props
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'outlined':
        return styles.outlined;
      case 'flat':
        return styles.flat;
      case 'elevated':
      default:
        return styles.elevated;
    }
  };

  return (
    <View style={[styles.card, getVariantStyle(), style]} {...props}>
      {title ? (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      ) : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
};

export default CustomCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  elevated: {
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    elevation: 0,
  },
  flat: {
    backgroundColor: COLORS.surfaceSubtle,
    elevation: 0,
  },
  header: {
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  title: {
    fontSize: FONT_SIZES.md + 1,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  body: {
    // Allows flexible children nesting (images, inputs, buttons, etc.)
  },
});
