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
} from 'react-native';
import { auth } from './firebaseAuth';

const RegisterScreen = ({ onNavigateToLogin, onBackToLab }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Step 75: In RegisterScreen.js, call auth().createUserWithEmailAndPassword(email, password)
  // on submit, wrapped in try/catch, and navigate to the home screen on success.
  const handleSignUp = async () => {
    setErrorMessage(null);

    if (!email.trim() || !password || !confirmPassword) {
      const msg = 'Please fill out all registration fields.';
      setErrorMessage(msg);
      Alert.alert('Validation Error', msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = 'Passwords do not match. Please verify.';
      setErrorMessage(msg);
      Alert.alert('Validation Error', msg);
      return;
    }

    if (password.length < 6) {
      const msg = 'Password must be at least 6 characters long.';
      setErrorMessage(msg);
      Alert.alert('Weak Password', msg);
      return;
    }

    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      // On success, onAuthStateChanged listener handles navigation to HomeScreen!
      Alert.alert('Registration Successful', `Account created for ${email.trim()}! Logging you in...`);
    } catch (error) {
      console.warn('Registration Error:', error);
      let friendly = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        friendly = 'This email is already registered. Try logging in instead.';
      } else if (error.code === 'auth/invalid-email') {
        friendly = 'The email address is improperly formatted.';
      } else if (error.code === 'auth/weak-password') {
        friendly = 'The password is too weak. Please use at least 6 characters.';
      } else if (error.message) {
        friendly = error.message;
      }
      setErrorMessage(friendly);
      Alert.alert('Registration Failed', friendly);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Top Header */}
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

        {/* Title */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>📝</Text>
          </View>
          <Text style={styles.appTitle}>Create Account</Text>
          <Text style={styles.appSubtitle}>Firebase Authentication Registration</Text>
        </View>

        {/* Error Box */}
        {errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        )}

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="newuser@example.com"
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

          <Text style={styles.inputLabel}>Create Password</Text>
          <TextInput
            style={styles.input}
            placeholder="At least 6 characters"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              setErrorMessage(null);
            }}
          />

          <Text style={styles.inputLabel}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter password"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            autoCapitalize="none"
            value={confirmPassword}
            onChangeText={(val) => {
              setConfirmPassword(val);
              setErrorMessage(null);
            }}
          />

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Register with Firebase</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer Link */}
        <View style={styles.footerLinkRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoIcon: {
    fontSize: 28,
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
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
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
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default RegisterScreen;
