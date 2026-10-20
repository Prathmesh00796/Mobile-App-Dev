import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Switch,
} from 'react-native';
import CustomHeader from '../components/CustomHeader';
import CustomCard from '../components/CustomCard';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { COLORS, FONT_SIZES, RADIUS, SPACING, THEME_PRESETS } from '../theme';

interface SettingsScreenProps {
  onBack?: () => void;
  onNavigateProfile?: () => void;
  primaryColor: string;
  onSelectPrimaryColor: (color: string) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onNavigateProfile,
  primaryColor,
  onSelectPrimaryColor,
}) => {
  // Account Form state
  const [username, setUsername] = useState('Prem Chopade');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Toggle preferences
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [biometrics, setBiometrics] = useState(true);

  const handleUpdatePassword = () => {
    if (!currentPass || !newPass) {
      Alert.alert('Incomplete Form', 'Please enter both current and new passwords.');
      return;
    }
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setCurrentPass('');
      setNewPass('');
      Alert.alert('Security Updated', 'Password was successfully updated across screens!');
    }, 600);
  };

  return (
    <View style={styles.screen}>
      {/* Header reused with different title & subtitle */}
      <CustomHeader
        title="App Settings"
        subtitle="Experiment 06 • Cross-Screen Consistency"
        onLeftPress={onBack}
        leftIcon="←"
        onRightPress={onNavigateProfile}
        rightIcon="👤"
        primaryColor={primaryColor}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 46: Test changing a single value in theme.js (Live Theme Switcher) */}
        <CustomCard
          title="Step 46 • Live Theme Test"
          subtitle="Change primary theme color & observe instant update across screens"
          variant="elevated"
        >
          <Text style={styles.instructionsText}>
            Select a color token below to test Step 46 live. This changes the primary color token applied to Headers, Inputs, Cards, and Buttons:
          </Text>

          <View style={styles.paletteRow}>
            {Object.entries(THEME_PRESETS || {}).map(([key, preset]) => {
              const isSelected = primaryColor === preset.primary;
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.colorOption,
                    { backgroundColor: preset.primary },
                    isSelected && styles.colorOptionSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => onSelectPrimaryColor(preset.primary)}
                >
                  {isSelected && <Text style={styles.checkmarkText}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.activeColorBanner}>
            <View style={[styles.colorChip, { backgroundColor: primaryColor }]} />
            <Text style={styles.activeColorText}>
              Active Color Token: <Text style={{ fontWeight: 'bold' }}>{primaryColor}</Text>
            </Text>
          </View>
        </CustomCard>

        {/* Step 45: Reusing CustomCard, CustomInput, CustomButton with different content */}
        <CustomCard
          title="Account Security"
          subtitle="Reusing CustomInput and CustomButton components"
          variant="elevated"
        >
          <CustomInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            icon="🏷️"
            primaryColor={primaryColor}
          />

          <CustomInput
            label="Current Password"
            value={currentPass}
            onChangeText={setCurrentPass}
            placeholder="••••••••"
            secureTextEntry
            icon="🔒"
            primaryColor={primaryColor}
          />

          <CustomInput
            label="New Password"
            value={newPass}
            onChangeText={setNewPass}
            placeholder="••••••••"
            secureTextEntry
            icon="🔑"
            helperText="Minimum 8 characters with numbers & symbols"
            primaryColor={primaryColor}
          />

          <CustomButton
            title="Update Credentials"
            icon="🛡️"
            onPress={handleUpdatePassword}
            loading={isUpdating}
            primaryColor={primaryColor}
          />
        </CustomCard>

        {/* Preferences Card */}
        <CustomCard
          title="Notification Preferences"
          subtitle="Demonstrating composition with toggles"
          variant="outlined"
        >
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Push Notifications</Text>
              <Text style={styles.toggleDesc}>Receive instant real-time alerts</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: COLORS.border, true: primaryColor }}
              thumbColor={COLORS.surface}
            />
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Weekly Digest</Text>
              <Text style={styles.toggleDesc}>Summary of activity sent to your email</Text>
            </View>
            <Switch
              value={emailDigest}
              onValueChange={setEmailDigest}
              trackColor={{ false: COLORS.border, true: primaryColor }}
              thumbColor={COLORS.surface}
            />
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Biometric Authentication</Text>
              <Text style={styles.toggleDesc}>Face ID or Fingerprint unlock</Text>
            </View>
            <Switch
              value={biometrics}
              onValueChange={setBiometrics}
              trackColor={{ false: COLORS.border, true: primaryColor }}
              thumbColor={COLORS.surface}
            />
          </View>
        </CustomCard>

        {/* Step 47: Theme Tokens Verification Card */}
        <CustomCard
          title="Design Tokens Summary (theme.js)"
          subtitle="Step 47 • Layout & Spacing Consistency"
          variant="flat"
        >
          <View style={styles.tokensGrid}>
            <View style={styles.tokenItem}>
              <Text style={styles.tokenKey}>Primary Color</Text>
              <Text style={[styles.tokenValue, { color: primaryColor }]}>{primaryColor}</Text>
            </View>
            <View style={styles.tokenItem}>
              <Text style={styles.tokenKey}>Card Radius</Text>
              <Text style={styles.tokenValue}>{RADIUS.md}px</Text>
            </View>
            <View style={styles.tokenItem}>
              <Text style={styles.tokenKey}>Body Spacing</Text>
              <Text style={styles.tokenValue}>{SPACING.md}px</Text>
            </View>
            <View style={styles.tokenItem}>
              <Text style={styles.tokenKey}>Title Size</Text>
              <Text style={styles.tokenValue}>{FONT_SIZES.title}px</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <CustomButton
              title="Return to Profile"
              variant="outline"
              size="sm"
              onPress={onNavigateProfile || (() => { })}
              primaryColor={primaryColor}
              style={{ flex: 1, marginRight: SPACING.xs }}
            />
            <CustomButton
              title="Reset Settings"
              variant="secondary"
              size="sm"
              onPress={() => {
                setPushEnabled(true);
                setEmailDigest(false);
                setBiometrics(true);
                Alert.alert('Reset', 'Settings restored to defaults.');
              }}
              style={{ flex: 1, marginLeft: SPACING.xs }}
            />
          </View>
        </CustomCard>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  instructionsText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  paletteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  colorOption: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  colorOptionSelected: {
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.08 }],
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  activeColorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  colorChip: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.xs,
    marginRight: SPACING.sm,
  },
  activeColorText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  toggleInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  toggleTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  toggleDesc: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rowDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.xs,
  },
  tokensGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  tokenItem: {
    width: '48%',
    backgroundColor: COLORS.surface,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tokenKey: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  tokenValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
