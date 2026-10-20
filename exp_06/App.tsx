import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import { COLORS, FONT_SIZES, RADIUS, SPACING } from './theme';

interface Exp6Props {
  onBackToLab?: () => void;
}

export default function App({ onBackToLab }: Exp6Props) {
  // Screen State: 'profile' or 'settings'
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');

  // Theme State: defaults to COLORS.primary from theme.js
  // When changed (e.g. from SettingsScreen), it updates ALL screens immediately (Step 46)
  const [primaryColor, setPrimaryColor] = useState<string>(COLORS.primary);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />

      {/* Top Lab Header Banner */}
      <View style={[styles.topBanner, { backgroundColor: primaryColor }]}>
        <View style={styles.bannerRow}>
          {onBackToLab && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackToLab}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>‹ Lab Home</Text>
            </TouchableOpacity>
          )}

          <View style={styles.bannerTitleContainer}>
            <Text style={styles.bannerBadge}>CO3 • EXPERIMENT 06</Text>
            <Text style={styles.bannerTitle}>Component Composition & Themes</Text>
          </View>
        </View>
      </View>

      {/* Active Screen View */}
      <View style={styles.screenContainer}>
        {activeTab === 'profile' ? (
          <ProfileScreen
            onBack={onBackToLab}
            onNavigateSettings={() => setActiveTab('settings')}
            primaryColor={primaryColor}
          />
        ) : (
          <SettingsScreen
            onBack={() => setActiveTab('profile')}
            onNavigateProfile={() => setActiveTab('profile')}
            primaryColor={primaryColor}
            onSelectPrimaryColor={setPrimaryColor}
          />
        )}
      </View>

      {/* Persistent Bottom Tab Navigation Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'profile' && styles.tabItemActive,
          ]}
          activeOpacity={0.8}
          onPress={() => setActiveTab('profile')}
        >
          <Text
            style={[
              styles.tabIcon,
              activeTab === 'profile' && { color: primaryColor },
            ]}
          >
            👤
          </Text>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'profile' && [styles.tabLabelActive, { color: primaryColor }],
            ]}
          >
            Profile Screen
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'settings' && styles.tabItemActive,
          ]}
          activeOpacity={0.8}
          onPress={() => setActiveTab('settings')}
        >
          <Text
            style={[
              styles.tabIcon,
              activeTab === 'settings' && { color: primaryColor },
            ]}
          >
            ⚙️
          </Text>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'settings' && [styles.tabLabelActive, { color: primaryColor }],
            ]}
          >
            Settings Screen
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBanner: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.sm,
  },
  backButtonText: {
    color: COLORS.textInverse,
    fontWeight: '700',
    fontSize: FONT_SIZES.xs,
  },
  bannerTitleContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bannerBadge: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: COLORS.textInverse,
    fontSize: FONT_SIZES.xs + 1,
    fontWeight: '600',
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  tabItemActive: {
    backgroundColor: COLORS.surfaceSubtle,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  tabLabelActive: {
    fontWeight: '700',
  },
});
