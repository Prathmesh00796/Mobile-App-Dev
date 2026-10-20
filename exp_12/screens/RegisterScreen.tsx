import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { theme } from '../theme';
import { CustomButton } from '../components/CustomButton';
import { CustomInput } from '../components/CustomInput';
import campusAuth from '../services/firebaseAuth';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
  onBackToLab?: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigateToLogin,
  onBackToLab,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Engineering');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage('Please fill out all required registration fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await campusAuth.createUserWithEmailAndPassword(
        email,
        password,
        fullName,
        studentId,
        department
      );
      Alert.alert('Registration Successful', `Welcome to the Campus Portal, ${fullName}!`);
    } catch (e: any) {
      setErrorMessage(e.message || 'Registration failed.');
      Alert.alert('Registration Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Top Header */}
        <View style={styles.topBar}>
          {onBackToLab && (
            <TouchableOpacity style={styles.backButton} onPress={onBackToLab}>
              <Text style={styles.backText}>‹ Lab Menu</Text>
            </TouchableOpacity>
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>EXPERIMENT E12 • CO6</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Student Registration</Text>
          <Text style={styles.subtitle}>
            Create your account to view events, register, and save favorites
          </Text>
        </View>

        {errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        )}

        {/* Form Card */}
        <View style={styles.card}>
          <CustomInput
            label="Full Name *"
            placeholder="e.g. Jordan Lee"
            icon="👤"
            value={fullName}
            onChangeText={setFullName}
          />

          <CustomInput
            label="Campus Email *"
            placeholder="jordan@campus.edu"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="✉️"
            value={email}
            onChangeText={setEmail}
          />

          <CustomInput
            label="Student ID"
            placeholder="e.g. CS-2026-108"
            icon="🆔"
            value={studentId}
            onChangeText={setStudentId}
          />

          <CustomInput
            label="Department"
            placeholder="e.g. Information Technology"
            icon="🏛️"
            value={department}
            onChangeText={setDepartment}
          />

          <CustomInput
            label="Password *"
            placeholder="Min 6 characters"
            secureTextEntry
            icon="🔒"
            value={password}
            onChangeText={setPassword}
          />

          <CustomInput
            label="Confirm Password *"
            placeholder="Re-type password"
            secureTextEntry
            icon="🔒"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <CustomButton
            title="Create Student Profile"
            onPress={handleRegister}
            loading={loading}
            style={{ marginTop: 8 }}
          />
        </View>

        {/* Login Link */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already registered? </Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text style={styles.footerLink}>Sign In Here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.xl,
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  backButton: {
    paddingVertical: 4,
  },
  backText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    color: theme.colors.primaryDark,
    fontSize: 10,
    fontWeight: '800',
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.title,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  errorBox: {
    backgroundColor: theme.colors.dangerLight,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  footerLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
});

export default RegisterScreen;
