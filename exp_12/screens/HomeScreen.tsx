import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { theme } from '../theme';
import { useApp } from '../context/AppContext';
import { CampusEvent } from '../types';
import { CustomCard } from '../components/CustomCard';

interface HomeScreenProps {
  onSelectEvent: (eventId: string) => void;
  onOpenFavorites: () => void;
  onOpenProfile: () => void;
  onOpenApkBuild: () => void;
  onBackToLab?: () => void;
}

const CATEGORIES = ['All', 'Tech', 'Cultural', 'Sports', 'Workshop', 'Seminar'] as const;

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectEvent,
  onOpenFavorites,
  onOpenProfile,
  onOpenApkBuild,
  onBackToLab,
}) => {
  const { events, loading, error, refreshEvents, isFavorite, toggleFavorite, favorites, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter events based on search input and category chips
  const filteredEvents = events.filter((ev) => {
    const matchesCategory = selectedCategory === 'All' || ev.category === selectedCategory;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderEventItem = ({ item }: { item: CampusEvent }) => {
    const favoriteActive = isFavorite(item.id);

    return (
      <CustomCard onPress={() => onSelectEvent(item.id)} style={styles.eventCard}>
        {/* Event Banner Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.eventImage} resizeMode="cover" />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
          <TouchableOpacity
            style={[styles.favoriteHeartBtn, favoriteActive && styles.favoriteHeartBtnActive]}
            onPress={() => toggleFavorite(item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.favoriteHeartIcon}>{favoriteActive ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {/* Card Details */}
        <View style={styles.cardBody}>
          <View style={styles.metaRow}>
            <Text style={styles.dateText}>📅 {item.date}</Text>
            <Text style={styles.timeText}>⏰ {item.time.split(' - ')[0]}</Text>
          </View>

          <Text style={styles.eventTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.eventVenue} numberOfLines={1}>
            📍 {item.venue}
          </Text>

          <View style={styles.footerRow}>
            <View style={styles.organizerRow}>
              <Text style={styles.organizerText} numberOfLines={1}>
                🏛️ {item.organizer}
              </Text>
            </View>
            <View style={styles.capacityBadge}>
              <Text style={styles.capacityText}>
                {item.registeredCount}/{item.capacity} Spots
              </Text>
            </View>
          </View>
        </View>
      </CustomCard>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {onBackToLab && (
            <TouchableOpacity style={styles.backButton} onPress={onBackToLab}>
              <Text style={styles.backText}>‹ Lab</Text>
            </TouchableOpacity>
          )}
          <View>
            <Text style={styles.headerGreeting}>Welcome, {user?.fullName?.split(' ')[0] || 'Student'}</Text>
            <Text style={styles.headerSub}>Explore Campus Events & Activities</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionIconBtn} onPress={onOpenFavorites}>
            <Text style={styles.actionIcon}>⭐</Text>
            {favorites.length > 0 && (
              <View style={styles.counterBadge}>
                <Text style={styles.counterText}>{favorites.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionIconBtn} onPress={onOpenProfile}>
            <Text style={styles.actionIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* APK Deployment Banner */}
      <TouchableOpacity style={styles.apkBanner} onPress={onOpenApkBuild}>
        <View style={styles.apkBannerLeft}>
          <Text style={styles.apkIcon}>📦</Text>
          <View>
            <Text style={styles.apkTitle}>Android Release APK Hub (Steps 96-97)</Text>
            <Text style={styles.apkSub}>Gradle assembleRelease • Keystore • APK generation</Text>
          </View>
        </View>
        <Text style={styles.apkArrow}>›</Text>
      </TouchableOpacity>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title, venue, or keyword..."
          placeholderTextColor={theme.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter Chips */}
      <View style={styles.categoriesWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const active = selectedCategory === item;
            return (
              <TouchableOpacity
                style={[styles.categoryChip, active && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Main Events Feed with FlatList */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Fetching live events from REST API...</Text>
          <Text style={styles.loadingSub}>https://jsonplaceholder.typicode.com/posts</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <View style={styles.errorCard}>
            <Text style={styles.errorEmoji}>⚠️</Text>
            <Text style={styles.errorTitle}>REST API Offline / Fallback Active</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={refreshEvents}>
              <Text style={styles.retryText}>Retry API Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderEventItem}
          contentContainerStyle={styles.eventsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refreshEvents}
              colors={[theme.colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No matching events</Text>
              <Text style={styles.emptySub}>Try searching for another keyword or category.</Text>
            </View>
          }
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
  header: {
    backgroundColor: theme.colors.headerBg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    paddingRight: 12,
  },
  backText: {
    color: theme.colors.secondary,
    fontSize: 15,
    fontWeight: '700',
  },
  headerGreeting: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  headerSub: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  actionIcon: {
    fontSize: 16,
  },
  counterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: theme.colors.accent,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  counterText: {
    color: '#0F172A',
    fontSize: 10,
    fontWeight: '800',
  },
  apkBanner: {
    backgroundColor: '#312E81',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#4338CA',
  },
  apkBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  apkIcon: {
    fontSize: 20,
  },
  apkTitle: {
    color: '#E0E7FF',
    fontSize: 12,
    fontWeight: '800',
  },
  apkSub: {
    color: '#A5B4FC',
    fontSize: 10,
  },
  apkArrow: {
    color: '#818CF8',
    fontSize: 20,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  clearSearch: {
    color: theme.colors.textMuted,
    fontSize: 14,
    padding: 4,
  },
  categoriesWrapper: {
    paddingVertical: 8,
  },
  categoryList: {
    paddingHorizontal: theme.spacing.lg,
    gap: 8,
  },
  categoryChip: {
    backgroundColor: theme.colors.cardBackground,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: theme.colors.white,
    fontWeight: '800',
  },
  eventsList: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 24,
  },
  eventCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 14,
  },
  imageContainer: {
    position: 'relative',
    height: 140,
    width: '100%',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: theme.colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  favoriteHeartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteHeartBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  favoriteHeartIcon: {
    fontSize: 16,
  },
  cardBody: {
    padding: 14,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  eventVenue: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  organizerRow: {
    flex: 1,
  },
  organizerText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  capacityBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  capacityText: {
    color: theme.colors.primaryDark,
    fontSize: 10,
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  loadingSub: {
    marginTop: 4,
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  errorCard: {
    backgroundColor: theme.colors.dangerLight,
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  errorEmoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#991B1B',
  },
  errorText: {
    fontSize: 12,
    color: '#B91C1C',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  retryBtn: {
    backgroundColor: theme.colors.danger,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  emptySub: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default HomeScreen;
