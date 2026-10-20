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

interface LoginScreenProps {
  onNavigateToRegister: () => void;
  onBackToLab?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToRegister,
  onBackToLab,
}) => {
  const [email, setEmail] = useState('alex@campus.edu');
  const [password, setPassword] = useState('pass123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async () => {
    setErrorMessage(null);
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your campus email and password.');
      return;
    }

    setLoading(true);
    try {
      await campusAuth.signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      setErrorMessage(e.message || 'Authentication failed. Please verify credentials.');
      Alert.alert('Login Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('alex@campus.edu');
    setPassword('pass123');
    setErrorMessage(null);
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
              <Text style={styles.backText}>‹ Practical Lab</Text>
            </TouchableOpacity>
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>EXPERIMENT E12 • CO6</Text>
          </View>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBox}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>🎓</Text>
          </View>
          <Text style={styles.title}>Campus Event Manager</Text>
          <Text style={styles.subtitle}>
            Student Portal • Authentication, Dynamic REST API & Local Storage
          </Text>
        </View>

        {/* Quick Fill Hint */}
        <TouchableOpacity style={styles.demoBanner} onPress={handleQuickDemoFill}>
          <Text style={styles.demoTitle}>⚡ Quick Demo Credentials Ready</Text>
          <Text style={styles.demoSub}>Tap to load: alex@campus.edu / pass123</Text>
        </TouchableOpacity>

        {errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        )}

        {/* Form Card */}
        <View style={styles.card}>
          <CustomInput
            label="Campus Email Address"
            placeholder="student@campus.edu"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="✉️"
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              setErrorMessage(null);
            }}
          />

          <CustomInput
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            icon="🔒"
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              setErrorMessage(null);
            }}
          />

          <CustomButton
            title="Sign In to Student Portal"
            onPress={handleSignIn}
            loading={loading}
            style={{ marginTop: 8 }}
          />
        </View>

        {/* Register Link */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New campus student? </Text>
          <TouchableOpacity onPress={onNavigateToRegister}>
            <Text style={styles.footerLink}>Register Account</Text>
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
    marginBottom: theme.spacing.lg,
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
  heroBox: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 30,
  },
  title: {
    fontSize: theme.typography.title,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  demoBanner: {
    backgroundColor: theme.colors.successLight,
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  demoTitle: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '800',
  },
  demoSub: {
    color: '#166534',
    fontSize: 11,
    marginTop: 2,
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

export default LoginScreen;
