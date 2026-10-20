import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface CustomHeaderProps {
  title: string;
  onMenuPress: () => void;
  onCartPress: () => void;
  cartCount?: number;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  onMenuPress,
  onCartPress,
  cartCount = 0,
}) => {
  return (
    <View style={styles.header}>

      {/* Menu */}

      <TouchableOpacity
        style={styles.iconButton}
        onPress={onMenuPress}
      >
        <Text style={styles.icon}>☰</Text>
      </TouchableOpacity>


      {/* Title */}

      <Text style={styles.title}>
        {title}
      </Text>


      {/* Cart */}

      <TouchableOpacity
        style={styles.cartButton}
        onPress={onCartPress}
      >
        <Text style={styles.icon}>🛒</Text>

        {cartCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {cartCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
    height: 65,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    elevation: 5,
  },

  iconButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cartButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  icon: {
    fontSize: 23,
    color: '#FFFFFF',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#EF4444',
    width: 19,
    height: 19,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});