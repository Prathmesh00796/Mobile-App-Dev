import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import MediaScreen from './MediaScreen';
import LocationScreen from './LocationScreen';
import NotificationScreen from './NotificationScreen';

interface Exp11Props {
  onBackToLab?: () => void;
}

type TabType = 'media' | 'location' | 'notifications';

export default function App({ onBackToLab }: Exp11Props) {
  const [activeTab, setActiveTab] = useState<TabType>('media');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0F172A" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        {onBackToLab && (
          <TouchableOpacity style={styles.backButton} onPress={onBackToLab}>
            <Text style={styles.backButtonText}>‹ Lab</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerTitles}>
          <Text style={styles.headerSubtitle}>EXPERIMENT E11 • CO5</Text>
          <Text style={styles.headerTitle}>Native Device Features</Text>
        </View>
      </View>

      {/* Feature Selector Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'media' && styles.tabItemActive]}
          onPress={() => setActiveTab('media')}
        >
          <Text style={styles.tabIcon}>📸</Text>
          <Text style={[styles.tabLabel, activeTab === 'media' && styles.tabLabelActive]}>
            Camera / Media
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'location' && styles.tabItemActive]}
          onPress={() => setActiveTab('location')}
        >
          <Text style={styles.tabIcon}>📍</Text>
          <Text style={[styles.tabLabel, activeTab === 'location' && styles.tabLabelActive]}>
            GPS Location
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'notifications' && styles.tabItemActive]}
          onPress={() => setActiveTab('notifications')}
        >
          <Text style={styles.tabIcon}>🔔</Text>
          <Text style={[styles.tabLabel, activeTab === 'notifications' && styles.tabLabelActive]}>
            Notifications
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active Feature Screen */}
      <View style={styles.body}>
        {activeTab === 'media' && <MediaScreen />}
        {activeTab === 'location' && <LocationScreen />}
        {activeTab === 'notifications' && <NotificationScreen />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingRight: 14,
    paddingVertical: 4,
  },
  backButtonText: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '700',
  },
  headerTitles: {
    flex: 1,
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    padding: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: '#334155',
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabLabelActive: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  body: {
    flex: 1,
  },
});
