import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, RADIUS } from '../theme';

interface CustomHeaderProps {
  title: string;
  subtitle?: string;
  onLeftPress?: () => void;
  leftIcon?: string;
  onRightPress?: () => void;
  rightIcon?: string;
  rightBadge?: string | number;
  primaryColor?: string; // Optional dynamic override for live demo
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  subtitle,
  onLeftPress,
  leftIcon = '←',
  onRightPress,
  rightIcon,
  rightBadge,
  primaryColor,
}) => {
  const headerBg = primaryColor || COLORS.primary;

  return (
    <View style={[styles.headerContainer, { backgroundColor: headerBg }]}>
      <StatusBar backgroundColor={headerBg} barStyle="light-content" />

      <View style={styles.contentRow}>
        {/* Left Action */}
        {onLeftPress ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onLeftPress}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.iconText}>{leftIcon}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        {/* Center Title & Subtitle */}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* Right Action */}
        {onRightPress && rightIcon ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onRightPress}
            activeOpacity={0.7}
          >
            <Text style={styles.iconText}>{rightIcon}</Text>
            {rightBadge !== undefined && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{rightBadge}</Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: COLORS.textInverse,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.sm,
  },
  title: {
    color: COLORS.textInverse,
    fontSize: FONT_SIZES.title,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
    fontWeight: '500',
  },
  placeholder: {
    width: 40,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: COLORS.danger,
    minWidth: 18,
    height: 18,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.textInverse,
    fontSize: FONT_SIZES.xs - 2,
    fontWeight: 'bold',
  },
});
