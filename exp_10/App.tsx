import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { auth, FirebaseUser } from './firebaseAuth';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';

interface Exp10Props {
  onBackToLab?: () => void;
}

export default function App({ onBackToLab }: Exp10Props) {
  // Step 78: Track current user state and auth initialization
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // Step 78: Use auth().onAuthStateChanged(user => {...}) to track login state
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [initializing]);

  if (initializing) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <StatusBar backgroundColor="#0F172A" barStyle="light-content" />
        <ActivityIndicator size="large" color="#EA580C" />
        <Text style={styles.loadingText}>Initializing Firebase Auth...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0F172A" barStyle="light-content" />

      {/* Step 78: Conditionally render either the authentication stack or main app stack */}
      {currentUser ? (
        // Main App Stack (Authenticated)
        <HomeScreen user={currentUser} onBackToLab={onBackToLab} />
      ) : (
        // Authentication Stack (Unauthenticated)
        authView === 'login' ? (
          <LoginScreen
            onNavigateToRegister={() => setAuthView('register')}
            onBackToLab={onBackToLab}
          />
        ) : (
          <RegisterScreen
            onNavigateToLogin={() => setAuthView('login')}
            onBackToLab={onBackToLab}
          />
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
});
