import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../theme';
import { useApp } from '../context/AppContext';
import { CustomHeader } from '../components/CustomHeader';
import { CustomButton } from '../components/CustomButton';

interface ProfileScreenProps {
  onBack: () => void;
  onOpenFavorites: () => void;
  onOpenApkBuild: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onOpenFavorites,
  onOpenApkBuild,
}) => {
  const { user, registeredEvents, favorites, events, unregisterForEvent, logout } = useApp();

  const registeredEventObjects = events.filter((e) => registeredEvents.includes(e.id));

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of your student portal account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Student Profile" subtitle="Firebase Authenticated" onBack={onBack} />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollBody}>
        {/* Student Badge Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarIcon}>🎓</Text>
          </View>
          <Text style={styles.userName}>{user?.fullName || 'Campus Student'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'student@campus.edu'}</Text>
          <View style={styles.sessionPill}>
            <View style={styles.greenDot} />
            <Text style={styles.sessionText}>Active Firebase Session</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{registeredEvents.length}</Text>
            <Text style={styles.statLabel}>Registered</Text>
          </View>

          <TouchableOpacity style={styles.statBox} onPress={onOpenFavorites}>
            <Text style={styles.statNumber}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favorites ⭐</Text>
          </TouchableOpacity>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{events.length}</Text>
            <Text style={styles.statLabel}>Total Events</Text>
          </View>
        </View>

        {/* Student Academic Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Academic Records</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Student ID</Text>
            <Text style={styles.detailValue}>{user?.studentId || 'CS-2024-042'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Department</Text>
            <Text style={styles.detailValue}>
              {user?.department || 'Computer Science & Engineering'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Firebase UID</Text>
            <Text style={styles.detailValueMono} numberOfLines={1}>
              {user?.uid || 'uid_demo_101'}
            </Text>
          </View>
        </View>

        {/* Registered Event Passes */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>
            Registered Event Passes ({registeredEvents.length})
          </Text>

          {registeredEventObjects.length === 0 ? (
            <Text style={styles.emptyRegisteredText}>
              You haven't registered for any events yet. Check out the event catalog on the Home screen!
            </Text>
          ) : (
            registeredEventObjects.map((ev) => (
              <View key={ev.id} style={styles.registeredItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.regTitle}>{ev.title}</Text>
                  <Text style={styles.regMeta}>
                    📅 {ev.date} • 📍 {ev.venue}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.cancelRegBtn}
                  onPress={() => unregisterForEvent(ev.id)}
                >
                  <Text style={styles.cancelRegText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Quick Links */}
        <TouchableOpacity style={styles.apkNavCard} onPress={onOpenApkBuild}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 22 }}>📦</Text>
            <View>
              <Text style={styles.apkNavTitle}>Release APK & Build Center</Text>
              <Text style={styles.apkNavSub}>
                Instructions & keystore config for Step 96
              </Text>
            </View>
          </View>
          <Text style={styles.apkNavArrow}>›</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <CustomButton
          title="🚪 Sign Out of Student Account"
          variant="danger"
          size="medium"
          onPress={handleLogout}
          style={{ marginTop: 8, marginBottom: 30 }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  scrollBody: {
    padding: theme.spacing.lg,
  },
  profileCard: {
    backgroundColor: '#1E293B',
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarIcon: {
    fontSize: 28,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.white,
  },
  userEmail: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
    marginBottom: 10,
  },
  sessionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  sessionText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: 16,
  },
  cardHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 12,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  detailValueMono: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: theme.colors.primary,
    fontWeight: '700',
    maxWidth: 180,
  },
  emptyRegisteredText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    paddingVertical: 10,
  },
  registeredItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  regTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  regMeta: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  cancelRegBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  cancelRegText: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '700',
  },
  apkNavCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: theme.borderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginBottom: 16,
  },
  apkNavTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#312E81',
  },
  apkNavSub: {
    fontSize: 11,
    color: '#4338CA',
  },
  apkNavArrow: {
    fontSize: 20,
    color: '#4F46E5',
    fontWeight: '700',
  },
});

export default ProfileScreen;
