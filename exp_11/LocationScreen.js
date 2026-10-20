import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import DeviceService from './deviceServices';

const Location = DeviceService.Location;

const LocationScreen = () => {
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Permission testing toggle for Step 87
  const [locationPerm, setLocationPerm] = useState(DeviceService.getLocationPermission());

  const toggleLocationPerm = () => {
    const next = !locationPerm;
    DeviceService.setLocationPermission(next);
    setLocationPerm(next);
  };

  // Step 84: Request foreground location permission with
  // Location.requestForegroundPermissionsAsync(), then call Location.getCurrentPositionAsync()
  // and display the latitude/longitude on screen.
  const handleGetLocation = async () => {
    setErrorMessage(null);
    setLoading(true);

    try {
      // 1. Request foreground permission
      const permissionResult = await Location.requestForegroundPermissionsAsync();

      if (!permissionResult.granted) {
        const msg = 'Foreground Location permission denied! Please allow access to fetch GPS coordinates.';
        setErrorMessage(msg);
        Alert.alert('Permission Denied', msg);
        return;
      }

      // 2. Fetch current GPS location
      const position = await Location.getCurrentPositionAsync({
        accuracy: 5,
      });

      // 3. Store and display
      setLocationData(position);
    } catch (err) {
      console.warn('Geolocation error:', err);
      const msg = err.message || 'Error occurred while acquiring device GPS location.';
      setErrorMessage(msg);
      Alert.alert('Location Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Permission Toggle Card */}
      <View style={styles.permissionCard}>
        <Text style={styles.permTitle}>⚙️ Runtime Permission Toggles (Test Step 87)</Text>
        <Text style={styles.permSub}>Toggle permission state to test graceful failure vs success:</Text>

        <View style={styles.permRow}>
          <Text style={styles.permLabel}>Foreground Location Permission:</Text>
          <TouchableOpacity
            style={[styles.permButton, locationPerm ? styles.permGranted : styles.permDenied]}
            onPress={toggleLocationPerm}
          >
            <Text style={styles.permButtonText}>{locationPerm ? '✓ GRANTED' : '✕ DENIED'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Error Banner */}
      {errorMessage && (
        <View style={styles.errorNotice}>
          <Text style={styles.errorNoticeText}>⚠️ {errorMessage}</Text>
        </View>
      )}

      {/* GPS Output Display Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>📍 Device Geolocation Status</Text>
          <View style={styles.sensorBadge}>
            <Text style={styles.sensorBadgeText}>GPS SENSOR</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Triangulating GPS Satellites...</Text>
            <Text style={styles.loadingSub}>Location.getCurrentPositionAsync()</Text>
          </View>
        ) : locationData ? (
          <View style={styles.coordsContainer}>
            <View style={styles.coordBox}>
              <Text style={styles.coordLabel}>LATITUDE</Text>
              <Text style={styles.coordValue}>{locationData.coords.latitude}° N</Text>
            </View>

            <View style={styles.coordBox}>
              <Text style={styles.coordLabel}>LONGITUDE</Text>
              <Text style={styles.coordValue}>{locationData.coords.longitude}° E</Text>
            </View>

            <View style={styles.metaGrid}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Altitude</Text>
                <Text style={styles.metaValue}>{locationData.coords.altitude} m</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Accuracy</Text>
                <Text style={styles.metaValue}>±{locationData.coords.accuracy} m</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Speed</Text>
                <Text style={styles.metaValue}>{locationData.coords.speed} m/s</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Timestamp</Text>
                <Text style={styles.metaValue}>
                  {new Date(locationData.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🌍</Text>
            <Text style={styles.emptyTitle}>Coordinates Not Loaded</Text>
            <Text style={styles.emptySub}>
              Tap the button below to request permission and query device GPS coordinates.
            </Text>
          </View>
        )}
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={handleGetLocation}
        disabled={loading}
      >
        <Text style={styles.primaryButtonEmoji}>🎯</Text>
        <Text style={styles.primaryButtonText}>Get Current Position</Text>
        <Text style={styles.primaryButtonSub}>Location.getCurrentPositionAsync()</Text>
      </TouchableOpacity>

      {/* Code Signature Box */}
      <View style={styles.codeBox}>
        <Text style={styles.codeTitle}>💻 Procedure Step 84</Text>
        <Text style={styles.codeText}>
          {`// 1. Request Permission\nconst { status } = await Location.requestForegroundPermissionsAsync();\n// 2. Fetch Coordinates\nif (status === 'granted') {\n  const location = await Location.getCurrentPositionAsync({});\n  console.log(location.coords.latitude, location.coords.longitude);\n}`}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
  },
  permissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  permTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  permSub: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 10,
  },
  permRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  permLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  permButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  permGranted: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  permDenied: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  permButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  errorNotice: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  errorNoticeText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sensorBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sensorBadgeText: {
    color: '#047857',
    fontSize: 10,
    fontWeight: '800',
  },
  loadingBox: {
    padding: 30,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontWeight: '700',
    color: '#065F46',
    fontSize: 14,
  },
  loadingSub: {
    marginTop: 2,
    color: '#64748B',
    fontSize: 11,
  },
  coordsContainer: {
    marginTop: 4,
  },
  coordBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  coordLabel: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  coordValue: {
    color: '#14532D',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
  },
  metaItem: {
    width: '50%',
    paddingVertical: 4,
  },
  metaLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  emptySub: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  primaryButtonSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    marginTop: 2,
  },
  codeBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
  },
  codeTitle: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  codeText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontFamily: 'monospace',
    lineHeight: 14,
  },
});

export default LocationScreen;
