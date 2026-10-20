import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { CartContext, CartItem } from '../CartContext';

interface CartScreenProps {
  onContinueShopping?: () => void;
}

const CartScreen: React.FC<CartScreenProps> = ({ onContinueShopping }) => {
  // Step 51: useContext(CartContext) to read shared cart items and action handlers
  const cartContext = useContext(CartContext);
  if (!cartContext) {
    throw new Error('CartScreen must be used within a CartProvider');
  }

  const { cartItems, addItem, removeItem, deleteItem, clearCart, totalItemsCount } =
    cartContext;

  // Local state for running total and visual effect audit logs
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [effectRunCount, setEffectRunCount] = useState<number>(0);
  const [lastLogMessage, setLastLogMessage] = useState<string>('Initialized');

  // Step 52: useEffect with cartItems as dependency to calculate and log total price automatically
  useEffect(() => {
    const computedTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setTotalPrice(computedTotal);
    setEffectRunCount((prev) => prev + 1);

    const logEntry = `[${new Date().toLocaleTimeString()}] Cart updated: ${cartItems.length} unique items (${cartItems.reduce(
      (acc, i) => acc + i.quantity,
      0
    )} total qty), Total: ₹${computedTotal.toLocaleString()}`;

    setLastLogMessage(logEntry);
    console.log(logEntry);
  }, [cartItems]); // <-- Step 52: [cartItems] dependency array

  const handleCheckout = () => {
    Alert.alert(
      'Order Confirmed! 🎉',
      `Thank you for your purchase! Total amount ₹${totalPrice.toLocaleString()} paid successfully.`,
      [
        {
          text: 'OK',
          onPress: () => clearCart(),
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to remove all items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: () => clearCart() },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🛒 Your Cart</Text>
          <Text style={styles.headerSubtitle}>
            Synchronized globally across screens via Context API
          </Text>
        </View>

        {cartItems.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.clearHeaderBtn}>
            <Text style={styles.clearHeaderText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Step 52 Demonstration Banner: Real-time useEffect Hook Status */}
      <View style={styles.effectBanner}>
        <View style={styles.effectTitleRow}>
          <Text style={styles.effectBadge}>STEP 52 • useEffect Hook</Text>
          <Text style={styles.effectCounter}>Triggered: {effectRunCount} times</Text>
        </View>
        <Text style={styles.effectDescription}>
          Watching <Text style={styles.codeText}>[cartItems]</Text> dependency array.
        </Text>
        <Text style={styles.effectLogText} numberOfLines={2}>
          {lastLogMessage}
        </Text>
      </View>

      {/* Cart Content */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛍️</Text>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Go back to the Products Catalog and add some items to see Context API state synchronization in action!
          </Text>

          {onContinueShopping && (
            <TouchableOpacity
              style={styles.continueButton}
              activeOpacity={0.8}
              onPress={onContinueShopping}
            >
              <Text style={styles.continueButtonText}>← Explore Products</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Cart Items List */}
          <Text style={styles.sectionHeader}>
            Items ({totalItemsCount})
          </Text>

          {cartItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemEmojiContainer}>
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
              </View>

              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemUnitPrice}>
                  ₹{item.price.toLocaleString()} each
                </Text>

                {/* Subtotal for this item */}
                <Text style={styles.itemSubtotal}>
                  Line Total: ₹{(item.price * item.quantity).toLocaleString()}
                </Text>
              </View>

              {/* Quantity Stepper & Delete */}
              <View style={styles.actionColumn}>
                <TouchableOpacity
                  onPress={() => deleteItem(item.id)}
                  style={styles.deleteButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>

                <View style={styles.stepperContainer}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => removeItem(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.stepperBtnText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.stepperValue}>{item.quantity}</Text>

                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => addItem(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.stepperBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          {/* Running Order Summary (Step 51 & 52) */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Bill Breakdown</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal ({totalItemsCount} items)</Text>
              <Text style={styles.summaryValue}>₹{totalPrice.toLocaleString()}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={[styles.summaryValue, { color: '#059669' }]}>FREE</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>GST & Taxes (18%)</Text>
              <Text style={styles.summaryValue}>
                ₹{Math.round(totalPrice * 0.18).toLocaleString()}
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalValue}>
                ₹{Math.round(totalPrice * 1.18).toLocaleString()}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              activeOpacity={0.8}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>
                Place Order • ₹{Math.round(totalPrice * 1.18).toLocaleString()}
              </Text>
            </TouchableOpacity>

            {onContinueShopping && (
              <TouchableOpacity
                style={styles.shopMoreButton}
                activeOpacity={0.8}
                onPress={onContinueShopping}
              >
                <Text style={styles.shopMoreButtonText}>+ Add More Products</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default CartScreen;

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
  clearHeaderBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  clearHeaderText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  effectBanner: {
    backgroundColor: '#EEF2FF',
    margin: 12,
    marginBottom: 6,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  effectTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  effectBadge: {
    backgroundColor: '#4338CA',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  effectCounter: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3730A3',
  },
  effectDescription: {
    fontSize: 11,
    color: '#4B5563',
    marginBottom: 4,
  },
  codeText: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#312E81',
  },
  effectLogText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#1E1B4B',
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 70,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 32,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  itemEmojiContainer: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemEmoji: {
    fontSize: 28,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  itemCategory: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  itemUnitPrice: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
  },
  itemSubtotal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 3,
  },
  actionColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 70,
  },
  deleteButton: {
    padding: 2,
  },
  deleteIcon: {
    fontSize: 14,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stepperBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  stepperBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  stepperValue: {
    paddingHorizontal: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E40AF',
  },
  checkoutButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  shopMoreButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  shopMoreButtonText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '600',
  },
});
