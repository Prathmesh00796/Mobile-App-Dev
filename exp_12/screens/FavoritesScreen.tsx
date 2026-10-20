import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { theme } from '../theme';
import { useApp } from '../context/AppContext';
import { CampusEvent } from '../types';
import { CustomHeader } from '../components/CustomHeader';
import { CustomCard } from '../components/CustomCard';
import { CustomButton } from '../components/CustomButton';

interface FavoritesScreenProps {
  onBack: () => void;
  onSelectEvent: (eventId: string) => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  onBack,
  onSelectEvent,
}) => {
  const { events, favorites, toggleFavorite, clearAllLocalData } = useApp();

  const favoriteEvents = events.filter((e) => favorites.includes(e.id));

  const handleClearAll = () => {
    if (favorites.length === 0) return;
    Alert.alert(
      'Clear Saved Favorites',
      'Are you sure you want to remove all bookmarked events from local device storage?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearAllLocalData();
          },
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }: { item: CampusEvent }) => (
    <CustomCard onPress={() => onSelectEvent(item.id)} style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
      <View style={styles.cardInfo}>
        <View style={styles.topRow}>
          <Text style={styles.category}>{item.category}</Text>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => toggleFavorite(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.removeIcon}>✕ Remove</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.date}>📅 {item.date}</Text>
        <Text style={styles.venue} numberOfLines={1}>
          📍 {item.venue}
        </Text>
      </View>
    </CustomCard>
  );

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Saved Favorites"
        subtitle="AsyncStorage Local Persistence"
        onBack={onBack}
        rightAction={
          favorites.length > 0
            ? {
                icon: '🗑️',
                label: 'Clear',
                onPress: handleClearAll,
              }
            : undefined
        }
      />

      {/* Info Pill */}
      <View style={styles.metaBanner}>
        <Text style={styles.metaBannerText}>
          💾 Stored locally in device AsyncStorage with key @campus_favorites_v1
        </Text>
      </View>

      {favoriteEvents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⭐</Text>
          <Text style={styles.emptyTitle}>No Favorites Bookmarked</Text>
          <Text style={styles.emptySub}>
            Tap the heart icon (🤍) on any event card to save it locally to this list.
          </Text>
          <CustomButton
            title="Browse Campus Events"
            onPress={onBack}
            style={{ marginTop: 16 }}
          />
        </View>
      ) : (
        <FlatList
          data={favoriteEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderFavoriteItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  metaBanner: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E7FF',
  },
  metaBannerText: {
    color: '#3730A3',
    fontSize: 11,
    fontWeight: '700',
  },
  list: {
    padding: theme.spacing.lg,
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    gap: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
  },
  cardInfo: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  category: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  removeBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  removeIcon: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  date: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  venue: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  emptySub: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});

export default FavoritesScreen;
