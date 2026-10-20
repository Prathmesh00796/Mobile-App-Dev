import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

export default function Register({navigation}: any) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const register = () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      Alert.alert('Error', 'Mobile number must be exactly 10 digits');
      return;
    }

    if (!email.endsWith('@gmail.com')) {
      Alert.alert('Error', 'Please enter a valid Gmail address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (confirmPassword === '') {
      Alert.alert('Error', 'Please confirm your password');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    Alert.alert('Success', 'Registration successful!', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('Login'),
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Register your new account
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="10 Digit Mobile Number"
        placeholderTextColor="#888"
        keyboardType="number-pad"
        maxLength={10}
        value={mobile}
        onChangeText={setMobile}
      />

      <TextInput
        style={styles.input}
        placeholder="Gmail Address"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={styles.registerButton}
        onPress={register}>
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F1F5F9',
    padding: 25,
    justifyContent: 'center',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 30,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 15,
    color: '#000',
  },

  registerButton: {
    backgroundColor: '#16A34A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },

  backText: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '600',
  },
});