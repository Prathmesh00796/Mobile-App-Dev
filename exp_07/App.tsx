import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { CartProvider, useCart } from './CartContext';
import ProductListScreen from './screens/ProductListScreen';
import CartScreen from './screens/CartScreen';

interface Exp7Props {
  onBackToLab?: () => void;
}

// Inner navigator component that consumes CartContext to show real-time cart badge
const Exp7MainContent: React.FC<Exp7Props> = ({ onBackToLab }) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'cart'>('catalog');
  const { totalItemsCount } = useCart();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1E40AF" barStyle="light-content" />

      {/* Top Lab Header Banner */}
      <View style={styles.topBanner}>
        <View style={styles.bannerRow}>
          {onBackToLab && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackToLab}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>‹ Lab Home</Text>
            </TouchableOpacity>
          )}

          <View style={styles.bannerTitleContainer}>
            <Text style={styles.bannerBadge}>CO3 • EXPERIMENT 07</Text>
            <Text style={styles.bannerTitle}>Hooks & Context API State</Text>
          </View>
        </View>
      </View>

      {/* Active Screen View */}
      <View style={styles.screenContainer}>
        {activeTab === 'catalog' ? (
          <ProductListScreen onOpenCart={() => setActiveTab('cart')} />
        ) : (
          <CartScreen onContinueShopping={() => setActiveTab('catalog')} />
        )}
      </View>

      {/* Bottom Navigation Tab Bar with Synchronized Context State */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'catalog' && styles.tabItemActive,
          ]}
          activeOpacity={0.8}
          onPress={() => setActiveTab('catalog')}
        >
          <Text style={styles.tabIcon}>🛍️</Text>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'catalog' && styles.tabLabelActive,
            ]}
          >
            Products Catalog
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'cart' && styles.tabItemActive,
          ]}
          activeOpacity={0.8}
          onPress={() => setActiveTab('cart')}
        >
          <View style={styles.cartIconWrapper}>
            <Text style={styles.tabIcon}>🛒</Text>
            {totalItemsCount > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{totalItemsCount}</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'cart' && styles.tabLabelActive,
            ]}
          >
            My Cart ({totalItemsCount})
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Step 49: Wrap the application tree with <CartProvider>
export default function App({ onBackToLab }: Exp7Props) {
  return (
    <CartProvider>
      <Exp7MainContent onBackToLab={onBackToLab} />
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  topBanner: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  bannerTitleContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bannerBadge: {
    color: '#BFDBFE',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: '#EFF6FF',
  },
  cartIconWrapper: {
    position: 'relative',
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#EF4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tabLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
});
