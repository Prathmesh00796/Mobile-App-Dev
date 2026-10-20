import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { auth } from './firebaseAuth';

const HomeScreen = ({ user, onBackToLab }) => {
  const [loggingOut, setLoggingOut] = useState(false);

  // Step 79: Add a 'Logout' button in the main app that calls auth().signOut()
  // and confirm the app returns to the login screen.
  const handleLogout = () => {
    Alert.alert('Confirm Sign Out', 'Are you sure you want to log out of your Firebase account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          try {
            await auth().signOut();
            // onAuthStateChanged in App.tsx detects null and flips to LoginScreen
          } catch (e) {
            Alert.alert('Sign Out Error', e.message || 'Failed to sign out.');
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {onBackToLab && (
          <TouchableOpacity style={styles.labBackButton} onPress={onBackToLab}>
            <Text style={styles.labBackText}>‹ Lab Menu</Text>
          </TouchableOpacity>
        )}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>AUTHENTICATED STACK</Text>
        </View>
      </View>

      {/* Hero Welcome Card */}
      <View style={styles.heroCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>
        <Text style={styles.welcomeTitle}>Welcome Back!</Text>
        <Text style={styles.userEmail}>{user?.email || 'Logged In User'}</Text>
        <View style={styles.statusPill}>
          <View style={styles.greenDot} />
          <Text style={styles.statusPillText}>Firebase Session Active</Text>
        </View>
      </View>

      {/* Account Details Card */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Firebase User Profile</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>User UID</Text>
          <Text style={styles.detailValueMono} numberOfLines={1}>
            {user?.uid || 'N/A'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email</Text>
          <Text style={styles.detailValue}>{user?.email || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Provider</Text>
          <Text style={styles.detailValue}>password (Email/Password)</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Session Created</Text>
          <Text style={styles.detailValue}>
            {user?.createdAt ? new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
          </Text>
        </View>
      </View>

      {/* Lab Verification Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📋 E10 Lab Verification Checklist</Text>
        <Text style={styles.infoItem}>✓ Sign-Up: auth().createUserWithEmailAndPassword()</Text>
        <Text style={styles.infoItem}>✓ Sign-In: auth().signInWithEmailAndPassword()</Text>
        <Text style={styles.infoItem}>✓ Password Reset: auth().sendPasswordResetEmail()</Text>
        <Text style={styles.infoItem}>✓ Auth State Listener: auth().onAuthStateChanged()</Text>
        <Text style={styles.infoItem}>✓ Sign Out: auth().signOut()</Text>
      </View>

      {/* Step 79: Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, loggingOut && styles.buttonDisabled]}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.logoutButtonText}>🚪 Sign Out / Logout</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
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
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '800',
  },
  heroCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 14,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  statusPillText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  detailLabel: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
  detailValue: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '600',
  },
  detailValueMono: {
    color: '#2563EB',
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '700',
    maxWidth: 200,
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  infoTitle: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  infoItem: {
    color: '#1E40AF',
    fontSize: 12,
    marginVertical: 2,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default HomeScreen;
