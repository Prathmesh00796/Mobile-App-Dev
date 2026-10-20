import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function Login({navigation}: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    if (email.trim() === '') {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (!email.includes('@') || !email.endsWith('.com')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    Alert.alert('Success', 'Login successful!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={login}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <Text style={styles.or}>Don't have an account?</Text>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>REGISTER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 8,
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

  loginButton: {
    backgroundColor: '#2563EB',
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

  or: {
    textAlign: 'center',
    color: '#64748B',
    marginVertical: 18,
  },

  registerButton: {
    borderWidth: 2,
    borderColor: '#2563EB',
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
  },

  registerText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: 'bold',
  },
});