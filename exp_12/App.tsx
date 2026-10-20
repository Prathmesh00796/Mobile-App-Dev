import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { AppProvider, useApp } from './context/AppContext';
import { theme } from './theme';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import ProfileScreen from './screens/ProfileScreen';
import ApkBuildScreen from './screens/ApkBuildScreen';

interface Exp12Props {
  onBackToLab?: () => void;
}

type MainTab = 'events' | 'favorites' | 'profile' | 'apk';

const Exp12Navigator: React.FC<Exp12Props> = ({ onBackToLab }) => {
  const { user, favorites } = useApp();
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [currentTab, setCurrentTab] = useState<MainTab>('events');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Step 90: Conditional Stack Navigator based on Firebase Authentication state
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#0F172A" barStyle="light-content" />
        {authScreen === 'login' ? (
          <LoginScreen
            onNavigateToRegister={() => setAuthScreen('register')}
            onBackToLab={onBackToLab}
          />
        ) : (
          <RegisterScreen
            onNavigateToLogin={() => setAuthScreen('login')}
            onBackToLab={onBackToLab}
          />
        )}
      </SafeAreaView>
    );
  }

  // If viewing Event Detail
  if (selectedEventId) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#0F172A" barStyle="light-content" />
        <EventDetailScreen
          eventId={selectedEventId}
          onBack={() => setSelectedEventId(null)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0F172A" barStyle="light-content" />

      {/* Main Body */}
      <View style={styles.body}>
        {currentTab === 'events' && (
          <HomeScreen
            onSelectEvent={(id) => setSelectedEventId(id)}
            onOpenFavorites={() => setCurrentTab('favorites')}
            onOpenProfile={() => setCurrentTab('profile')}
            onOpenApkBuild={() => setCurrentTab('apk')}
            onBackToLab={onBackToLab}
          />
        )}

        {currentTab === 'favorites' && (
          <FavoritesScreen
            onBack={() => setCurrentTab('events')}
            onSelectEvent={(id) => setSelectedEventId(id)}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            onBack={() => setCurrentTab('events')}
            onOpenFavorites={() => setCurrentTab('favorites')}
            onOpenApkBuild={() => setCurrentTab('apk')}
          />
        )}

        {currentTab === 'apk' && (
          <ApkBuildScreen onBack={() => setCurrentTab('events')} />
        )}
      </View>

      {/* Bottom Tab Navigator */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, currentTab === 'events' && styles.tabItemActive]}
          onPress={() => setCurrentTab('events')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>🏠</Text>
          <Text
            style={[
              styles.tabLabel,
              currentTab === 'events' && styles.tabLabelActive,
            ]}
          >
            Events
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, currentTab === 'favorites' && styles.tabItemActive]}
          onPress={() => setCurrentTab('favorites')}
          activeOpacity={0.7}
        >
          <View style={{ position: 'relative' }}>
            <Text style={styles.tabIcon}>⭐</Text>
            {favorites.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{favorites.length}</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.tabLabel,
              currentTab === 'favorites' && styles.tabLabelActive,
            ]}
          >
            Favorites
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, currentTab === 'profile' && styles.tabItemActive]}
          onPress={() => setCurrentTab('profile')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>👤</Text>
          <Text
            style={[
              styles.tabLabel,
              currentTab === 'profile' && styles.tabLabelActive,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, currentTab === 'apk' && styles.tabItemActive]}
          onPress={() => setCurrentTab('apk')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>📦</Text>
          <Text
            style={[
              styles.tabLabel,
              currentTab === 'apk' && styles.tabLabelActive,
            ]}
          >
            APK Hub
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function App({ onBackToLab }: Exp12Props) {
  return (
    <AppProvider>
      <Exp12Navigator onBackToLab={onBackToLab} />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  body: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.tabBarBg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
    elevation: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabItemActive: {},
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  tabLabelActive: {
    color: theme.colors.primary,
    fontWeight: '800',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: theme.colors.accent,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#0F172A',
    fontSize: 9,
    fontWeight: '800',
  },
});
