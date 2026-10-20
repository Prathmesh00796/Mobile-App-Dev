import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { theme } from '../theme';
import { useApp } from '../context/AppContext';
import { CustomButton } from '../components/CustomButton';
import { CustomHeader } from '../components/CustomHeader';

interface EventDetailScreenProps {
  eventId: string;
  onBack: () => void;
}

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  eventId,
  onBack,
}) => {
  const {
    events,
    isFavorite,
    toggleFavorite,
    isRegistered,
    registerForEvent,
    unregisterForEvent,
    user,
  } = useApp();

  const event = events.find((e) => e.id === eventId);
  const favoriteActive = isFavorite(eventId);
  const registered = isRegistered(eventId);

  if (!event) {
    return (
      <View style={styles.container}>
        <CustomHeader title="Event Details" onBack={onBack} />
        <View style={styles.notFoundBox}>
          <Text style={styles.notFoundText}>Event not found or removed.</Text>
          <CustomButton title="Back to Events" onPress={onBack} style={{ marginTop: 12 }} />
        </View>
      </View>
    );
  }

  const handleRegistrationToggle = async () => {
    if (registered) {
      Alert.alert(
        'Cancel Registration',
        `Are you sure you want to cancel your registration for "${event.title}"?`,
        [
          { text: 'Keep Registration', style: 'cancel' },
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: async () => {
              await unregisterForEvent(eventId);
              Alert.alert('Registration Cancelled', 'Your slot has been released.');
            },
          },
        ]
      );
    } else {
      const success = await registerForEvent(eventId);
      if (success) {
        Alert.alert(
          'Registration Confirmed! 🎉',
          `Congratulations ${user?.fullName || 'Student'}! You are now registered for "${event.title}". A confirmation pass has been saved to your local storage.`
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title={event.category + ' Event'}
        subtitle="Campus Event Detail"
        onBack={onBack}
        rightAction={{
          icon: favoriteActive ? '❤️' : '🤍',
          label: favoriteActive ? 'Favorited' : 'Favorite',
          onPress: () => toggleFavorite(eventId),
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.imageUrl }} style={styles.bannerImage} resizeMode="cover" />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{event.category}</Text>
          </View>
        </View>

        {/* Main Info */}
        <View style={styles.body}>
          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.highlightGrid}>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightIcon}>📅</Text>
              <View>
                <Text style={styles.highlightLabel}>Date</Text>
                <Text style={styles.highlightValue}>{event.date}</Text>
              </View>
            </View>

            <View style={styles.highlightItem}>
              <Text style={styles.highlightIcon}>⏰</Text>
              <View>
                <Text style={styles.highlightLabel}>Time</Text>
                <Text style={styles.highlightValue}>{event.time}</Text>
              </View>
            </View>

            <View style={styles.highlightItem}>
              <Text style={styles.highlightIcon}>📍</Text>
              <View>
                <Text style={styles.highlightLabel}>Venue</Text>
                <Text style={styles.highlightValue}>{event.venue}</Text>
              </View>
            </View>

            <View style={styles.highlightItem}>
              <Text style={styles.highlightIcon}>👥</Text>
              <View>
                <Text style={styles.highlightLabel}>Attendees</Text>
                <Text style={styles.highlightValue}>
                  {event.registeredCount + (registered ? 1 : 0)} / {event.capacity}
                </Text>
              </View>
            </View>
          </View>

          {/* Registration Status Banner */}
          {registered && (
            <View style={styles.registeredBanner}>
              <Text style={styles.registeredIcon}>🎟️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.registeredTitle}>Pass Confirmed for this Event</Text>
                <Text style={styles.registeredSub}>
                  Persisted locally via AsyncStorage • Student: {user?.studentId || 'ID-101'}
                </Text>
              </View>
            </View>
          )}

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>About This Event</Text>
            <Text style={styles.descriptionText}>{event.description}</Text>
          </View>

          {/* Key Speaker */}
          {event.speaker && (
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Featured Speaker</Text>
              <View style={styles.speakerCard}>
                <View style={styles.speakerAvatar}>
                  <Text style={styles.speakerAvatarText}>🎙️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.speakerName}>{event.speaker}</Text>
                  <Text style={styles.speakerRole}>Guest Keynote Presenter</Text>
                </View>
              </View>
            </View>
          )}

          {/* Organizer Info */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Organizing Department</Text>
            <Text style={styles.organizerText}>🏛️ {event.organizer}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <CustomButton
              title={registered ? 'Cancel Event Pass' : '🎟️ Register for Event'}
              variant={registered ? 'danger' : 'primary'}
              size="large"
              onPress={handleRegistrationToggle}
            />

            <CustomButton
              title={favoriteActive ? '❤️ Remove from Favorites' : '🤍 Bookmark to Favorites'}
              variant="outline"
              size="medium"
              style={{ marginTop: 10, marginBottom: 30 }}
              onPress={() => toggleFavorite(eventId)}
            />
          </View>
        </View>
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
  imageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
  body: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  highlightGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: 16,
  },
  highlightItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  highlightIcon: {
    fontSize: 20,
  },
  highlightLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  highlightValue: {
    fontSize: 12,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  registeredBanner: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: theme.borderRadius.md,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  registeredIcon: {
    fontSize: 24,
  },
  registeredTitle: {
    color: '#15803D',
    fontSize: 13,
    fontWeight: '800',
  },
  registeredSub: {
    color: '#166534',
    fontSize: 10,
    marginTop: 2,
  },
  section: {
    marginBottom: 18,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  speakerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    padding: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    gap: 12,
  },
  speakerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakerAvatarText: {
    fontSize: 20,
  },
  speakerName: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  speakerRole: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  organizerText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  actionButtons: {
    marginTop: 8,
  },
  notFoundBox: {
    padding: 30,
    alignItems: 'center',
  },
  notFoundText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
  },
});

export default EventDetailScreen;
