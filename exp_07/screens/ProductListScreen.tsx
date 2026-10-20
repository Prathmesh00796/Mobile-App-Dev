import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { CartContext, Product } from '../CartContext';

// Product Catalog
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Wireless Noise-Canceling Headphones',
    price: 3499,
    emoji: '🎧',
    category: 'Electronics',
    description: 'High-fidelity audio with active noise cancellation and 30-hour battery life.',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Smart AMOLED Fitness Watch',
    price: 2499,
    emoji: '⌚',
    category: 'Wearables',
    description: 'Tracks heart rate, SpO2, sleep stages, and 50+ athletic workout modes.',
    rating: 4.7,
  },
  {
    id: 3,
    name: 'Mechanical RGB Gaming Keyboard',
    price: 1899,
    emoji: '⌨️',
    category: 'Accessories',
    description: 'Tactile blue switches, per-key RGB backlighting, and braided USB-C cable.',
    rating: 4.6,
  },
  {
    id: 4,
    name: 'Ergonomic Precision Wireless Mouse',
    price: 999,
    emoji: '🖱️',
    category: 'Accessories',
    description: 'Sculpted comfort grip, silent clicks, and dual Bluetooth / 2.4GHz connectivity.',
    rating: 4.5,
  },
  {
    id: 5,
    name: 'Fast 65W GaN Multi-Port Charger',
    price: 1299,
    emoji: '🔌',
    category: 'Electronics',
    description: 'Ultra-compact Gallium Nitride fast charger for laptops, phones, and tablets.',
    rating: 4.9,
  },
  {
    id: 6,
    name: 'Waterproof Bluetooth Speaker',
    price: 1799,
    emoji: '🔊',
    category: 'Audio',
    description: 'Deep 360° bass, IPX7 water resistance, and 12-hour continuous party playback.',
    rating: 4.7,
  },
];

interface ProductListScreenProps {
  onOpenCart?: () => void;
}

const ProductListScreen: React.FC<ProductListScreenProps> = ({ onOpenCart }) => {
  // Step 53: useState-driven loading indicator and products list
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [lastFetchedAt, setLastFetchedAt] = useState<string>('');

  // Step 50: Use useContext(CartContext) to access addItem and cartItems
  const cartContext = useContext(CartContext);
  if (!cartContext) {
    throw new Error('ProductListScreen must be used within a CartProvider');
  }
  const { addItem, cartItems, totalItemsCount } = cartContext;

  // Step 53: useEffect simulating API product fetching after a short delay
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(() => {
      if (isMounted) {
        setProducts(MOCK_PRODUCTS);
        setLoading(false);
        setLastFetchedAt(new Date().toLocaleTimeString());
      }
    }, 1200); // 1.2s simulated network latency

    // Cleanup function when unmounting
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
      setLastFetchedAt(new Date().toLocaleTimeString());
    }, 900);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  // Find quantity in cart for this product
  const getProductQuantity = (productId: number): number => {
    const item = cartItems.find((ci) => ci.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🛍️ Products Catalog</Text>
          <Text style={styles.headerSubtitle}>
            Global State with Context API & Hooks
          </Text>
        </View>

        {onOpenCart && (
          <TouchableOpacity
            style={styles.cartHeaderButton}
            onPress={onOpenCart}
            activeOpacity={0.8}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {totalItemsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItemsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Concept Info Banner */}
      <View style={styles.infoBanner}>
        <View style={styles.infoRow}>
          <Text style={styles.hookTag}>useState</Text>
          <Text style={styles.hookTag}>useEffect</Text>
          <Text style={styles.hookTag}>useContext</Text>
        </View>
        <Text style={styles.infoText}>
          Products are fetched asynchronously in <Text style={styles.codeText}>useEffect</Text>. Adding to cart calls <Text style={styles.codeText}>addItem()</Text> via <Text style={styles.codeText}>CartContext</Text>.
        </Text>
      </View>

      {/* Step 53: useState-driven loading indicator */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingTitle}>Fetching Products Catalog...</Text>
          <Text style={styles.loadingSubtitle}>
            Simulating async API call inside useEffect(callback, [])
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.fetchStatusRow}>
              <Text style={styles.fetchStatusText}>
                Catalog synced at {lastFetchedAt} • {products.length} items
              </Text>
              <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                <Text style={styles.refreshButtonText}>↻ Refresh</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => {
            const qty = getProductQuantity(item.id);
            return (
              <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.emojiContainer}>
                    <Text style={styles.emoji}>{item.emoji}</Text>
                  </View>
                  <View style={styles.cardDetails}>
                    <View style={styles.categoryRatingRow}>
                      <Text style={styles.category}>{item.category.toUpperCase()}</Text>
                      <Text style={styles.rating}>★ {item.rating}</Text>
                    </View>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <Text style={styles.price}>₹{item.price.toLocaleString()}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  {qty > 0 ? (
                    <View style={styles.inCartBadge}>
                      <Text style={styles.inCartText}>✓ In Cart ({qty})</Text>
                    </View>
                  ) : (
                    <View />
                  )}

                  <TouchableOpacity
                    style={[styles.addButton, qty > 0 && styles.addButtonActive]}
                    activeOpacity={0.8}
                    onPress={() => handleAddToCart(item)}
                  >
                    <Text style={styles.addButtonText}>
                      {qty > 0 ? '+ Add More' : '+ Add to Cart'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default ProductListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#BFDBFE',
    fontSize: 12,
    marginTop: 2,
  },
  cartHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartIcon: {
    fontSize: 22,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  infoBanner: {
    backgroundColor: '#FFFFFF',
    margin: 12,
    marginBottom: 6,
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  hookTag: {
    backgroundColor: '#EFF6FF',
    color: '#1D4ED8',
    fontWeight: '700',
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
  codeText: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#1E293B',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingTitle: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  loadingSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  listContent: {
    padding: 12,
    paddingBottom: 24,
  },
  fetchStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  fetchStatusText: {
    fontSize: 11,
    color: '#6B7280',
  },
  refreshButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  refreshButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
  },
  emojiContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 34,
  },
  cardDetails: {
    flex: 1,
  },
  categoryRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  rating: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F59E0B',
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  productDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 3,
    lineHeight: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
    marginTop: 6,
  },
  cardFooter: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inCartBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  inCartText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 1,
  },
  addButtonActive: {
    backgroundColor: '#1D4ED8',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
