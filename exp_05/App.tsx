import React, { useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';

import CustomHeader from './components/CustomHeader';
import CustomButton from './components/CustomButton';
import CustomCard from './components/CustomCard';
import CustomInput from './components/CustomInput';


/* =========================================================
   TYPES
   ========================================================= */

interface Product {
  id: number;
  name: string;
  price: number;
  emoji: string;
  description: string;
}

type Page =
  | 'home'
  | 'product'
  | 'cart'
  | 'profile';


/* =========================================================
   PRODUCT DATA
   ========================================================= */

const products: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 1499,
    emoji: '🎧',
    description:
      'Premium wireless headphones with clear sound and comfortable design.',
  },

  {
    id: 2,
    name: 'Smart Watch',
    price: 2499,
    emoji: '⌚',
    description:
      'Smart watch with fitness tracking, notifications and modern design.',
  },

  {
    id: 3,
    name: 'Running Shoes',
    price: 1999,
    emoji: '👟',
    description:
      'Comfortable lightweight running shoes suitable for everyday use.',
  },

  {
    id: 4,
    name: 'Backpack',
    price: 999,
    emoji: '🎒',
    description:
      'Stylish and spacious backpack for college, office and travel.',
  },
];


/* =========================================================
   APP
   ========================================================= */

export default function App() {

  const [page, setPage] = useState<Page>('home');

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [cart, setCart] = useState<Product[]>([]);

  const [name, setName] = useState<string>('');

  const [email, setEmail] = useState<string>('');


  /* =======================================================
     ADD TO CART
     ======================================================= */

  const addToCart = (product: Product): void => {

    setCart((previousCart) => [
      ...previousCart,
      product,
    ]);

    Alert.alert(
      'Added to Cart',
      `${product.name} added successfully!`,
    );
  };


  /* =======================================================
     OPEN PRODUCT
     ======================================================= */

  const openProduct = (product: Product): void => {

    setSelectedProduct(product);

    setPage('product');
  };


  /* =======================================================
     HEADER
     ======================================================= */

  const renderHeader = (): React.ReactNode => {

    let title = 'ShopEase';

    if (page === 'product') {
      title = 'Product Details';
    }

    if (page === 'cart') {
      title = 'My Cart';
    }

    if (page === 'profile') {
      title = 'My Profile';
    }

    return (
      <CustomHeader
        title={title}
        cartCount={cart.length}

        onMenuPress={() => {
          setPage('home');
        }}

        onCartPress={() => {
          setPage('cart');
        }}
      />
    );
  };


  /* =======================================================
     HOME PAGE
     ======================================================= */

  const HomePage = (): React.ReactNode => {

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* Welcome Banner */}

        <View style={styles.banner}>

          <Text style={styles.bannerTitle}>
            Welcome to ShopEase 🛍️
          </Text>

          <Text style={styles.bannerText}>
            Find the best products at the best prices.
          </Text>

          <CustomButton
            title="Shop Now"
            color="#111827"
            onPress={() => {}}
          />

        </View>


        {/* Products */}

        <Text style={styles.sectionTitle}>
          Popular Products
        </Text>


        {products.map((product: Product) => (

          <CustomCard key={product.id}>

            <View style={styles.productRow}>

              <View style={styles.productImage}>

                <Text style={styles.productEmoji}>
                  {product.emoji}
                </Text>

              </View>


              <View style={styles.productInfo}>

                <Text style={styles.productName}>
                  {product.name}
                </Text>

                <Text style={styles.price}>
                  ₹{product.price}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    openProduct(product)
                  }
                >
                  <Text style={styles.details}>
                    View Details →
                  </Text>
                </TouchableOpacity>

              </View>

            </View>


            <CustomButton
              title="Add to Cart"
              color="#2563EB"
              onPress={() =>
                addToCart(product)
              }
            />

          </CustomCard>

        ))}


        <CustomButton
          title="Go to Profile"
          color="#6B7280"
          onPress={() =>
            setPage('profile')
          }
        />

      </ScrollView>
    );
  };


  /* =======================================================
     PRODUCT PAGE
     ======================================================= */

  const ProductPage = (): React.ReactNode => {

    if (!selectedProduct) {
      return null;
    }

    return (
      <ScrollView
        contentContainerStyle={styles.content}
      >

        <CustomCard>

          <View style={styles.largeProductImage}>

            <Text style={styles.largeEmoji}>
              {selectedProduct.emoji}
            </Text>

          </View>


          <Text style={styles.detailName}>
            {selectedProduct.name}
          </Text>


          <Text style={styles.detailPrice}>
            ₹{selectedProduct.price}
          </Text>


          <Text style={styles.description}>
            {selectedProduct.description}
          </Text>


          <CustomButton
            title="Add to Cart"
            color="#16A34A"
            onPress={() =>
              addToCart(selectedProduct)
            }
          />


          <CustomButton
            title="Back to Home"
            color="#6B7280"
            onPress={() =>
              setPage('home')
            }
          />

        </CustomCard>

      </ScrollView>
    );
  };


  /* =======================================================
     CART PAGE
     ======================================================= */

  const CartPage = (): React.ReactNode => {

    const total: number = cart.reduce(
      (sum: number, item: Product) =>
        sum + item.price,
      0,
    );

    return (
      <ScrollView
        contentContainerStyle={styles.content}
      >

        <Text style={styles.sectionTitle}>
          Your Cart
        </Text>


        {cart.length === 0 ? (

          <CustomCard>

            <Text style={styles.emptyText}>
              Your cart is empty 🛒
            </Text>

            <CustomButton
              title="Start Shopping"
              onPress={() =>
                setPage('home')
              }
            />

          </CustomCard>

        ) : (

          <>
            {cart.map(
              (item: Product, index: number) => (

                <CustomCard key={index}>

                  <View style={styles.cartRow}>

                    <Text style={styles.cartEmoji}>
                      {item.emoji}
                    </Text>

                    <View style={styles.cartInfo}>

                      <Text style={styles.productName}>
                        {item.name}
                      </Text>

                      <Text style={styles.price}>
                        ₹{item.price}
                      </Text>

                    </View>

                  </View>

                </CustomCard>

              ),
            )}


            <CustomCard>

              <Text style={styles.totalLabel}>
                Total Amount
              </Text>

              <Text style={styles.total}>
                ₹{total}
              </Text>


              <CustomButton
                title="Checkout"
                color="#16A34A"
                onPress={() =>
                  Alert.alert(
                    'Order Placed',
                    'Thank you for shopping with ShopEase!',
                  )
                }
              />


              <CustomButton
                title="Continue Shopping"
                color="#2563EB"
                onPress={() =>
                  setPage('home')
                }
              />

            </CustomCard>

          </>

        )}

      </ScrollView>
    );
  };


  /* =======================================================
     PROFILE PAGE
     ======================================================= */

  const ProfilePage = (): React.ReactNode => {

    return (
      <ScrollView
        contentContainerStyle={styles.content}
      >

        <CustomCard>

          <Text style={styles.sectionTitle}>
            My Profile 👤
          </Text>


          <CustomInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />


          <CustomInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
          />


          <CustomButton
            title="Save Profile"
            color="#2563EB"
            onPress={() =>
              Alert.alert(
                'Profile Saved',
                `Welcome ${name || 'User'}!`,
              )
            }
          />

        </CustomCard>


        <CustomCard>

          <Text style={styles.cardHeading}>
            Account Settings
          </Text>


          <CustomButton
            title="My Orders"
            color="#7C3AED"
            onPress={() =>
              Alert.alert(
                'My Orders',
                'No previous orders.',
              )
            }
          />


          <CustomButton
            title="Logout"
            color="#DC2626"
            onPress={() =>
              Alert.alert(
                'Logout',
                'You have been logged out.',
              )
            }
          />

        </CustomCard>


        <CustomButton
          title="Back to Home"
          color="#6B7280"
          onPress={() =>
            setPage('home')
          }
        />

      </ScrollView>
    );
  };


  /* =======================================================
     PAGE ROUTER
     ======================================================= */

  const renderPage = (): React.ReactNode => {

    switch (page) {

      case 'home':
        return <HomePage />;

      case 'product':
        return <ProductPage />;

      case 'cart':
        return <CartPage />;

      case 'profile':
        return <ProfilePage />;

      default:
        return <HomePage />;
    }
  };


  /* =======================================================
     FINAL UI
     ======================================================= */

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar
        barStyle="light-content"
        backgroundColor="#2563EB"
      />

      {/* SAME HEADER ON EVERY PAGE */}

      {renderHeader()}

      {/* CURRENT PAGE */}

      {renderPage()}

    </SafeAreaView>
  );
}


/* =========================================================
   STYLES
   ========================================================= */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  content: {
    padding: 18,
    paddingBottom: 40,
  },


  /* Banner */

  banner: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 22,
  },

  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 7,
  },

  bannerText: {
    color: '#DBEAFE',
    fontSize: 14,
    marginBottom: 12,
  },


  /* Sections */

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },

  cardHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },


  /* Product */

  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  productImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  productEmoji: {
    fontSize: 45,
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5,
  },

  price: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 5,
  },

  details: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '600',
  },


  /* Product Details */

  largeProductImage: {
    height: 220,
    borderRadius: 15,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  largeEmoji: {
    fontSize: 100,
  },

  detailName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },

  detailPrice: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 15,
  },

  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 23,
    marginBottom: 15,
  },


  /* Cart */

  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cartEmoji: {
    fontSize: 40,
    marginRight: 15,
  },

  cartInfo: {
    flex: 1,
  },

  totalLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 5,
  },

  total: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },

  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 15,
  },

});