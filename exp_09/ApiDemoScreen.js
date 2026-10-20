import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
  ScrollView,
} from 'react-native';
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/users';
const INVALID_URL = 'https://invalid-api-test-offline-endpoint.typicode.xyz/users';

const ApiDemoScreen = ({ onBackToLab }) => {
  // Step 65: Define state variables data, loading, and error using useState
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Method switcher & lab controls
  const [activeMethod, setActiveMethod] = useState('fetch');
  const [simulateError, setSimulateError] = useState(false);
  const [responseTime, setResponseTime] = useState(null);
  const [showCodeComparison, setShowCodeComparison] = useState(false);

  // Step 66: Call API inside useEffect on initial mount
  useEffect(() => {
    fetchWithCurrentMethod();
  }, [activeMethod, simulateError]);

  const targetUrl = simulateError ? INVALID_URL : API_URL;

  // Step 66 & 67: Fetch API implementation with try/catch
  const fetchDataWithNativeFetch = async () => {
    const startTime = Date.now();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(targetUrl);
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status} (${response.statusText || 'Failed'})`);
      }
      const jsonResult = await response.json();
      setData(jsonResult);
      setResponseTime(Date.now() - startTime);
    } catch (err) {
      console.warn('Fetch error:', err.message);
      setError(err.message || 'Failed to fetch data using Fetch API. Check network connectivity.');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Step 70: Axios implementation with try/catch
  const fetchDataWithAxios = async () => {
    const startTime = Date.now();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(targetUrl, { timeout: 5000 });
      setData(response.data);
      setResponseTime(Date.now() - startTime);
    } catch (err) {
      console.warn('Axios error:', err.message);
      let errorMsg = 'Failed to fetch data using Axios.';
      if (err.response) {
        errorMsg = `Server Error: ${err.response.status} ${err.response.statusText}`;
      } else if (err.request) {
        errorMsg = 'Network Offline / No response received from server.';
      } else {
        errorMsg = err.message;
      }
      setError(errorMsg);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithCurrentMethod = () => {
    if (activeMethod === 'axios') {
      fetchDataWithAxios();
    } else {
      fetchDataWithNativeFetch();
    }
  };

  // Step 69: FlatList item renderer
  const renderUserCard = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.userInfo}>
        <View style={styles.userHeaderRow}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userIdBadge}>#{item.id}</Text>
        </View>
        <Text style={styles.userUsername}>@{item.username}</Text>
        <Text style={styles.userEmail}>✉ {item.email}</Text>
        <Text style={styles.userCompany}>🏢 {item.company?.name || 'Company N/A'}</Text>
        <Text style={styles.userLocation}>📍 {item.address?.city || 'Location N/A'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0F172A" barStyle="light-content" />

      {/* Top Header */}
      <View style={styles.header}>
        {onBackToLab && (
          <TouchableOpacity style={styles.backButton} onPress={onBackToLab}>
            <Text style={styles.backButtonText}>‹ Lab</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerContent}>
          <Text style={styles.headerSubtitle}>EXPERIMENT E09 • CO4</Text>
          <Text style={styles.headerTitle}>REST API Consumer</Text>
        </View>
      </View>

      {/* Method Switcher Tabs: Fetch vs Axios */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeMethod === 'fetch' && styles.tabButtonActive]}
          onPress={() => setActiveMethod('fetch')}
        >
          <Text style={[styles.tabText, activeMethod === 'fetch' && styles.tabTextActive]}>
            Native Fetch API
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeMethod === 'axios' && styles.tabButtonActive]}
          onPress={() => setActiveMethod('axios')}
        >
          <Text style={[styles.tabText, activeMethod === 'axios' && styles.tabTextActive]}>
            Axios Client
          </Text>
        </TouchableOpacity>
      </View>

      {/* Action Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.toolChip, simulateError && styles.toolChipError]}
          onPress={() => setSimulateError(!simulateError)}
        >
          <Text style={[styles.toolChipText, simulateError && styles.toolChipTextError]}>
            {simulateError ? '⚠️ Offline / Error (Active)' : '🌐 Normal API URL'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolChip}
          onPress={() => setShowCodeComparison(!showCodeComparison)}
        >
          <Text style={styles.toolChipText}>
            {showCodeComparison ? '✕ Hide Code' : '💻 Code Diff'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.refreshChip} onPress={fetchWithCurrentMethod}>
          <Text style={styles.refreshChipText}>↻ Reload</Text>
        </TouchableOpacity>
      </View>

      {/* Code Comparison Box */}
      {showCodeComparison && (
        <View style={styles.codeComparisonBox}>
          <Text style={styles.codeHeading}>Comparison: Fetch vs Axios</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.codeSnippetBox}>
              <Text style={styles.codeLabel}>[Fetch API]</Text>
              <Text style={styles.codeMono}>
                {`const res = await fetch(url);\nif (!res.ok) throw Error(res.status);\nconst data = await res.json();\nsetData(data);`}
              </Text>
            </View>
            <View style={[styles.codeSnippetBox, { marginLeft: 10 }]}>
              <Text style={styles.codeLabel}>[Axios Client]</Text>
              <Text style={styles.codeMono}>
                {`const res = await axios.get(url);\n// Automatically parsed JSON!\nsetData(res.data);`}
              </Text>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Status Bar Indicator */}
      <View style={styles.metaStatusBar}>
        <Text style={styles.metaText}>
          Client: <Text style={styles.metaBold}>{activeMethod.toUpperCase()}</Text>
        </Text>
        {responseTime !== null && (
          <Text style={styles.metaText}>
            Latency: <Text style={styles.metaBold}>{responseTime} ms</Text>
          </Text>
        )}
        <Text style={styles.metaText}>
          Records: <Text style={styles.metaBold}>{data.length}</Text>
        </Text>
      </View>

      {/* Step 68: Render ActivityIndicator while loading is true */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Fetching users via {activeMethod.toUpperCase()}...</Text>
          <Text style={styles.loadingSubtext}>https://jsonplaceholder.typicode.com/users</Text>
        </View>
      ) : error ? (
        /* Step 68: Render error Text if error is set */
        <View style={styles.centerContainer}>
          <View style={styles.errorBox}>
            <Text style={styles.errorEmoji}>⚠️</Text>
            <Text style={styles.errorTitle}>Network / API Error</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchWithCurrentMethod}>
              <Text style={styles.retryButtonText}>Retry API Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* Step 69: Use FlatList to render the fetched users */
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchWithCurrentMethod}
              colors={['#3B82F6']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No users found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

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
  headerContent: {
    flex: 1,
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    padding: 6,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  toolChip: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 6,
  },
  toolChipError: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  toolChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  toolChipTextError: {
    color: '#DC2626',
    fontWeight: '700',
  },
  refreshChip: {
    marginLeft: 'auto',
    backgroundColor: '#E0F2FE',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  refreshChipText: {
    color: '#0284C7',
    fontSize: 12,
    fontWeight: '700',
  },
  codeComparisonBox: {
    backgroundColor: '#0F172A',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  codeHeading: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  codeSnippetBox: {
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 6,
    minWidth: 260,
  },
  codeLabel: {
    color: '#FACC15',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  codeMono: {
    color: '#E2E8F0',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  metaStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
  },
  metaBold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  loadingSubtext: {
    marginTop: 4,
    fontSize: 11,
    color: '#64748B',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  errorEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 13,
    color: '#B91C1C',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  listContainer: {
    padding: 12,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  userHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  userIdBadge: {
    fontSize: 11,
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '700',
  },
  userUsername: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 2,
  },
  userCompany: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  userLocation: {
    fontSize: 12,
    color: '#64748B',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
  },
});

export default ApiDemoScreen;
