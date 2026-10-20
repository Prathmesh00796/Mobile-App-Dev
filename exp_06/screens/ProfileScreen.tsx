import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import CustomHeader from '../components/CustomHeader';
import CustomCard from '../components/CustomCard';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { COLORS, FONT_SIZES, RADIUS, SPACING } from '../theme';

interface ProfileScreenProps {
  onBack?: () => void;
  onNavigateSettings?: () => void;
  primaryColor?: string;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onNavigateSettings,
  primaryColor,
}) => {
  const activeColor = primaryColor || COLORS.primary;

  // Form State
  const [fullName, setFullName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@designsystem.io');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [role, setRole] = useState('Senior React Native Engineer');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert(
        'Profile Saved',
        `Changes for ${fullName} have been saved successfully using the unified theme!`
      );
    }, 600);
  };

  return (
    <View style={styles.screen}>
      {/* Step 43: CustomHeader at the top */}
      <CustomHeader
        title="User Profile"
        subtitle="Experiment 06 • Component Composition"
        onLeftPress={onBack}
        leftIcon="←"
        onRightPress={onNavigateSettings}
        rightIcon="⚙️"
        primaryColor={activeColor}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 44: Demonstrate Component Composition 
            Passing rich custom children (Avatar image, badge, styled details) inside CustomCard */}
        <CustomCard variant="elevated">
          <View style={styles.avatarRow}>
            {/* Composed Avatar Image Element */}
            <View style={[styles.avatarWrapper, { borderColor: activeColor }]}>
              <Text style={styles.avatarEmoji}>👨‍💻</Text>
              <View style={[styles.onlineDot, { backgroundColor: COLORS.success }]} />
            </View>

            {/* Composed User Summary Info */}
            <View style={styles.summaryInfo}>
              <View style={styles.nameBadgeRow}>
                <Text style={styles.displayName}>{fullName}</Text>
                <View style={[styles.proBadge, { backgroundColor: activeColor + '20' }]}>
                  <Text style={[styles.proBadgeText, { color: activeColor }]}>VERIFIED</Text>
                </View>
              </View>

              <Text style={styles.displayRole}>{role}</Text>
              <Text style={styles.locationText}>📍 San Francisco, CA • Active Now</Text>
            </View>
          </View>

          {/* Quick Metrics composed inside the same card */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: activeColor }]}>42</Text>
              <Text style={styles.metricLabel}>Components</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: activeColor }]}>98%</Text>
              <Text style={styles.metricLabel}>Consistency</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: activeColor }]}>100%</Text>
              <Text style={styles.metricLabel}>Themeable</Text>
            </View>
          </View>
        </CustomCard>

        {/* Step 43: CustomCard wrapping several CustomInput fields and a CustomButton */}
        <CustomCard
          title="Edit Profile Details"
          subtitle="All inputs and buttons share theme design tokens"
          variant="elevated"
        >
          <CustomInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            icon="👤"
            primaryColor={activeColor}
          />

          <CustomInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            icon="✉️"
            primaryColor={activeColor}
          />

          <CustomInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            icon="📱"
            primaryColor={activeColor}
          />

          <CustomInput
            label="Professional Title / Bio"
            value={role}
            onChangeText={setRole}
            placeholder="Enter title or bio"
            icon="💼"
            primaryColor={activeColor}
          />

          <CustomButton
            title="Save Profile Changes"
            icon="💾"
            onPress={handleSave}
            loading={isSaving}
            primaryColor={activeColor}
          />
        </CustomCard>

        {/* Quick Navigation to Settings Card */}
        <CustomCard variant="outlined">
          <View style={styles.navRow}>
            <View style={styles.navTextContainer}>
              <Text style={styles.navTitle}>App Settings Screen</Text>
              <Text style={styles.navSubtitle}>
                See how the same components look on a different screen.
              </Text>
            </View>
            {onNavigateSettings && (
              <CustomButton
                title="Open →"
                size="sm"
                variant="outline"
                onPress={onNavigateSettings}
                primaryColor={activeColor}
              />
            )}
          </View>
        </CustomCard>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarWrapper: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: SPACING.md,
  },
  avatarEmoji: {
    fontSize: 34,
  },
  onlineDot: {
    width: 14,
    height: 14,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.surface,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  summaryInfo: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  displayName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginRight: SPACING.xs,
  },
  proBadge: {
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  proBadgeText: {
    fontSize: FONT_SIZES.xs - 2,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  displayRole: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  locationText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm + 2,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navTextContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  navTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  navSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
