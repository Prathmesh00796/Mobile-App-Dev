import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { auth } from './firebaseAuth';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
  onBackToLab?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToRegister, onBackToLab }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot password modal state
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  // Step 76: In LoginScreen.js, call auth().signInWithEmailAndPassword(email, password) on submit,
  // and display an alert with a friendly message if it fails.
  const handleSignIn = async () => {
    setErrorMessage(null);
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      Alert.alert('Validation Error', 'Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      // On success, onAuthStateChanged listener handles navigation to HomeScreen
    } catch (error: any) {
      console.warn('Sign-In Error:', error);
      let friendlyMessage = 'Sign in failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        friendlyMessage = 'No account found with this email. Please check your spelling or register.';
      } else if (error.code === 'auth/wrong-password') {
        friendlyMessage = 'Incorrect password. Please verify and try again.';
      } else if (error.code === 'auth/invalid-email') {
        friendlyMessage = 'The email address format is invalid.';
      } else if (error.message) {
        friendlyMessage = error.message;
      }
      setErrorMessage(friendlyMessage);
      Alert.alert('Authentication Failed', friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 77: Add a 'Forgot Password?' link that prompts for an email and calls
  // auth().sendPasswordResetEmail(email), showing a confirmation message once sent.
  const handleSendResetEmail = async () => {
    if (!resetEmail.trim()) {
      Alert.alert('Input Required', 'Please enter your registered email address.');
      return;
    }

    setResetLoading(true);
    try {
      await auth().sendPasswordResetEmail(resetEmail);
      setResetModalVisible(false);
      Alert.alert(
        'Password Reset Sent',
        `A password reset link has been dispatched to ${resetEmail.trim()}. Check your inbox and follow the instructions.`
      );
      setResetEmail('');
    } catch (error: any) {
      Alert.alert('Reset Failed', error.message || 'Unable to send password reset email.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleQuickFillDemo = () => {
    setEmail('student@college.edu');
    setPassword('password123');
    setErrorMessage(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Lab Navigation Header */}
        <View style={styles.topBar}>
          {onBackToLab && (
            <TouchableOpacity style={styles.labBackButton} onPress={onBackToLab}>
              <Text style={styles.labBackText}>‹ Lab Menu</Text>
            </TouchableOpacity>
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>EXPERIMENT E10 • CO5</Text>
          </View>
        </View>

        {/* Brand Banner */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🔥</Text>
          </View>
          <Text style={styles.appTitle}>Firebase Auth</Text>
          <Text style={styles.appSubtitle}>Sign In with Email & Password</Text>
        </View>

        {/* Quick fill hint */}
        <TouchableOpacity style={styles.demoBanner} onPress={handleQuickFillDemo}>
          <Text style={styles.demoBannerTitle}>⚡ Demo Account Available</Text>
          <Text style={styles.demoBannerSub}>
            Tap here to auto-fill (student@college.edu / password123)
          </Text>
        </TouchableOpacity>

        {/* Error Alert Box */}
        {errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        )}

        {/* Form Fields */}
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="student@college.edu"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              setErrorMessage(null);
            }}
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              setErrorMessage(null);
            }}
          />

          {/* Step 77: 'Forgot Password?' link */}
          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => {
              setResetEmail(email);
              setResetModalVisible(true);
            }}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Register Navigation Link */}
        <View style={styles.footerLinkRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={onNavigateToRegister}>
            <Text style={styles.footerLink}>Sign Up / Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Step 77: Forgot Password Modal */}
      <Modal
        visible={resetModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setResetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <Text style={styles.modalDescription}>
              Enter your email address and Firebase Authentication will send you a secure password reset link.
            </Text>

            <TextInput
              style={[styles.input, { marginBottom: 16 }]}
              placeholder="youremail@example.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={resetEmail}
              onChangeText={setResetEmail}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setResetModalVisible(false)}
                disabled={resetLoading}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalConfirmButton, resetLoading && styles.buttonDisabled]}
                onPress={handleSendResetEmail}
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalConfirmText}>Send Reset Email</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  labBackButton: {
    paddingVertical: 6,
    paddingRight: 12,
  },
  labBackText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 15,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '800',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoIcon: {
    fontSize: 30,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  appSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  demoBanner: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  demoBannerTitle: {
    color: '#15803D',
    fontWeight: '700',
    fontSize: 12,
  },
  demoBannerSub: {
    color: '#166534',
    fontSize: 11,
    marginTop: 2,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 14,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },
  forgotText: {
    color: '#EA580C',
    fontSize: 13,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#EA580C',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#64748B',
    fontSize: 14,
  },
  footerLink: {
    color: '#EA580C',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalCancelText: {
    color: '#64748B',
    fontWeight: '600',
  },
  modalConfirmButton: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default LoginScreen;
