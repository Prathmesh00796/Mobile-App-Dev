import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { theme } from '../theme';

interface CustomHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: {
    icon: string;
    onPress: () => void;
    label?: string;
  };
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftRow}>
        {onBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </View>

      {rightAction && (
        <TouchableOpacity
          style={styles.rightButton}
          onPress={rightAction.onPress}
          activeOpacity={0.7}
        >
          <Text style={styles.rightIcon}>{rightAction.icon}</Text>
          {rightAction.label && (
            <Text style={styles.rightLabel}>{rightAction.label}</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.headerBg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    paddingRight: 14,
    paddingVertical: 2,
  },
  backText: {
    color: theme.colors.secondary,
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 28,
  },
  titleContainer: {
    flex: 1,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.white,
    fontSize: theme.typography.heading,
    fontWeight: '800',
  },
  rightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.md,
  },
  rightIcon: {
    fontSize: 16,
  },
  rightLabel: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default CustomHeader;
