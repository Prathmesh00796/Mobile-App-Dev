import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
} from 'react-native';

const products = [
  {
    id: '1',
    name: 'Laptop',
    price: '₹55,000',
    image: 'https://picsum.photos/200/150?1',
  },
  {
    id: '2',
    name: 'Smartphone',
    price: '₹25,000',
    image: 'https://picsum.photos/200/150?2',
  },
  {
    id: '3',
    name: 'Headphones',
    price: '₹2,500',
    image: 'https://picsum.photos/200/150?3',
  },
  {
    id: '4',
    name: 'Smart Watch',
    price: '₹4,000',
    image: 'https://picsum.photos/200/150?4',
  },
  {
    id: '5',
    name: 'Keyboard',
    price: '₹1,500',
    image: 'https://picsum.photos/200/150?5',
  },
];

export default function App() {
  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>MyStore</Text>
        <Text style={styles.menu}>☰</Text>
      </View>

      {/* ScrollView */}
      <Text style={styles.heading}>Featured Products</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}>

        <View style={styles.featureCard}>
          <Image
            source={{uri: 'https://picsum.photos/300/180?10'}}
            style={styles.featureImage}
          />
          <Text style={styles.featureText}>
            Latest Technology
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Image
            source={{uri: 'https://picsum.photos/300/180?11'}}
            style={styles.featureImage}
          />
          <Text style={styles.featureText}>
            Best Electronics
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Image
            source={{uri: 'https://picsum.photos/300/180?12'}}
            style={styles.featureImage}
          />
          <Text style={styles.featureText}>
            Special Offers
          </Text>
        </View>

      </ScrollView>

      {/* FlatList */}
      <Text style={styles.heading}>Products</Text>

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <View style={styles.productCard}>

            <Image
              source={{uri: item.image}}
              style={styles.productImage}
            />

            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                {item.name}
              </Text>

              <Text style={styles.price}>
                {item.price}
              </Text>

              <Text style={styles.available}>
                Available
              </Text>
            </View>

          </View>
        )}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: '4%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },

  logo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2563EB',
  },

  menu: {
    fontSize: 26,
    color: '#333',
  },

  heading: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 10,
    marginBottom: 12,
  },

  scrollView: {
    flexGrow: 0,
  },

  featureCard: {
    width: 260,
    marginRight: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },

  featureImage: {
    width: '100%',
    height: 140,
  },

  featureText: {
    fontSize: 17,
    fontWeight: 'bold',
    padding: 12,
    color: '#333',
  },

  list: {
    paddingBottom: 20,
  },

  productCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 10,
    flexDirection: 'row',
    elevation: 3,
  },

  productImage: {
    width: '30%',
    height: 100,
    borderRadius: 10,
  },

  productInfo: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'center',
  },

  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },

  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 5,
  },

  available: {
    color: '#16A34A',
    fontSize: 14,
  },
});