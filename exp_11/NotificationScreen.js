import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import DeviceService from './deviceServices';

const Notifications = DeviceService.Notifications;

const NotificationScreen = () => {
  const [pushToken, setPushToken] = useState(null);
  const [loadingToken, setLoadingToken] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const [notifTitle, setNotifTitle] = useState('Lab Notification E11');
  const [notifBody, setNotifBody] = useState('Dynamic device notification received successfully in foreground!');
  const [logs, setLogs] = useState([]);

  // Step 87: Permission testing toggle
  const [notifPerm, setNotifPerm] = useState(DeviceService.getNotificationPermission());

  const toggleNotifPerm = () => {
    const next = !notifPerm;
    DeviceService.setNotificationPermission(next);
    setNotifPerm(next);
  };

  // Step 86: Add a notification listener (Notifications.addNotificationReceivedListener)
  // to handle notifications received while the app is in the foreground.
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      const newLog = {
        id: 'log_' + Date.now(),
        title: notification.request.content.title,
        body: notification.request.content.body,
        receivedAt: new Date(notification.date).toLocaleTimeString(),
      };
      setLogs((prev) => [newLog, ...prev]);
      setCountdown(null);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Step 85a: Request permission and obtain Expo push token
  const handleGetPushToken = async () => {
    setLoadingToken(true);
    try {
      const permission = await Notifications.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Notification permission was denied by user settings.');
        return;
      }
      const tokenResult = await Notifications.getExpoPushTokenAsync();
      setPushToken(tokenResult.data);
      Alert.alert('Token Obtained', 'Device push token successfully generated for cloud messaging.');
    } catch (err) {
      console.warn('Push token error:', err);
      Alert.alert('Error', err.message || 'Failed to acquire push notification token.');
    } finally {
      setLoadingToken(false);
    }
  };

  // Step 85b: Schedule local notification
  const handleScheduleNotification = async () => {
    if (!notifTitle.trim() || !notifBody.trim()) {
      Alert.alert('Validation Error', 'Please supply both a notification title and body message.');
      return;
    }

    setScheduling(true);
    try {
      const permission = await Notifications.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Cannot schedule notification without granted permission.');
        setScheduling(false);
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notifTitle,
          body: notifBody,
          data: { courseOutcome: 'CO5', experiment: 'E11' },
        },
        trigger: {
          seconds: 3,
        },
      });

      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c && c > 1) return c - 1;
          clearInterval(timer);
          return null;
        });
      }, 1000);
    } catch (err) {
      console.warn('Schedule error:', err);
      Alert.alert('Scheduling Error', err.message || 'Could not schedule local notification.');
    } finally {
      setScheduling(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Permission Toggle Card */}
      <View style={styles.permissionCard}>
        <Text style={styles.permTitle}>⚙️ Runtime Permission Toggles (Test Step 87)</Text>
        <Text style={styles.permSub}>Toggle permission state to test graceful failure vs success:</Text>

        <View style={styles.permRow}>
          <Text style={styles.permLabel}>Notification Permission:</Text>
          <TouchableOpacity
            style={[styles.permButton, notifPerm ? styles.permGranted : styles.permDenied]}
            onPress={toggleNotifPerm}
          >
            <Text style={styles.permButtonText}>{notifPerm ? '✓ GRANTED' : '✕ DENIED'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Expo Push Token Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📲 Device Push Token (Step 85)</Text>
        <Text style={styles.cardSub}>
          Obtains device cloud messaging address via Notifications.getExpoPushTokenAsync()
        </Text>

        {pushToken ? (
          <View style={styles.tokenBox}>
            <Text style={styles.tokenLabel}>TOKEN ID:</Text>
            <Text style={styles.tokenValue} selectable>
              {pushToken}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.tokenButton}
            onPress={handleGetPushToken}
            disabled={loadingToken}
          >
            {loadingToken ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.tokenButtonText}>Request Push Token</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Schedule Notification Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⏰ Local Push Trigger (Step 85)</Text>
        <Text style={styles.cardSub}>
          Schedules notification trigger with a 3-second delay.
        </Text>

        <Text style={styles.inputLabel}>Notification Title</Text>
        <TextInput
          style={styles.input}
          value={notifTitle}
          onChangeText={setNotifTitle}
          placeholder="Notification title..."
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.inputLabel}>Body Message</Text>
        <TextInput
          style={[styles.input, { height: 60 }]}
          value={notifBody}
          onChangeText={setNotifBody}
          placeholder="Notification message..."
          placeholderTextColor="#94A3B8"
          multiline
        />

        {countdown !== null && (
          <View style={styles.countdownBanner}>
            <Text style={styles.countdownText}>
              ⏳ Notification arriving in {countdown}s... (Step 86 listener active)
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.scheduleButton, scheduling && styles.buttonDisabled]}
          onPress={handleScheduleNotification}
          disabled={scheduling}
        >
          <Text style={styles.scheduleButtonText}>🔔 Schedule Notification (3s Delay)</Text>
        </TouchableOpacity>
      </View>

      {/* Foreground Notification Received Log */}
      <View style={styles.card}>
        <View style={styles.logHeaderRow}>
          <Text style={styles.cardTitle}>📬 Foreground Listener Log (Step 86)</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{logs.length}</Text>
          </View>
        </View>

        {logs.length === 0 ? (
          <Text style={styles.noLogsText}>
            No notifications captured yet. Schedule one above to see foreground listener dispatch!
          </Text>
        ) : (
          logs.map((log) => (
            <View key={log.id} style={styles.logItem}>
              <View style={styles.logItemHeader}>
                <Text style={styles.logTitle}>🔔 {log.title}</Text>
                <Text style={styles.logTime}>{log.receivedAt}</Text>
              </View>
              <Text style={styles.logBody}>{log.body}</Text>
            </View>
          ))
        )}
      </View>

      {/* Code Signature Box */}
      <View style={styles.codeBox}>
        <Text style={styles.codeTitle}>💻 Procedure Steps 85 & 86</Text>
        <Text style={styles.codeText}>
          {`// Schedule Local Notification\nawait Notifications.scheduleNotificationAsync({\n  content: { title: '...', body: '...' },\n  trigger: { seconds: 3 },\n});\n\n// Step 86 Listener\nNotifications.addNotificationReceivedListener(notification => {\n  console.log('Received in foreground:', notification);\n});`}
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },
  tokenButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tokenButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  tokenBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  tokenLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4338CA',
  },
  tokenValue: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#1E1B4B',
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 10,
  },
  countdownBanner: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  countdownText: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '700',
  },
  scheduleButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  logHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  countBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    color: '#7C3AED',
    fontSize: 11,
    fontWeight: '800',
  },
  noLogsText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  logItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#8B5CF6',
  },
  logItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  logTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  logTime: {
    fontSize: 11,
    color: '#64748B',
  },
  logBody: {
    fontSize: 12,
    color: '#475569',
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

export default NotificationScreen;
