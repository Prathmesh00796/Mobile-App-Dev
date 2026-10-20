import { Alert } from 'react-native';

export interface PermissionResponse {
  status: 'granted' | 'denied' | 'undetermined';
  granted: boolean;
  canAskAgain: boolean;
}

export interface ImagePickerResult {
  canceled: boolean;
  assets?: Array<{
    uri: string;
    width: number;
    height: number;
    type?: string;
    fileName?: string;
    fileSize?: number;
  }>;
}

export interface LocationData {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    speed: number | null;
  };
  timestamp: number;
}

export interface NotificationContent {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface NotificationRequest {
  content: NotificationContent;
  trigger: {
    seconds?: number;
  };
}

export type NotificationListener = (notification: {
  request: { content: NotificationContent };
  date: number;
}) => void;

// In-memory permission state to allow students to test granted/denied paths (Step 87)
let cameraPermissionGranted = true;
let mediaLibraryPermissionGranted = true;
let locationPermissionGranted = true;
let notificationPermissionGranted = true;

const notificationListeners: NotificationListener[] = [];

// Curated sample capture assets for realistic device demonstrations
const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
];

const SAMPLE_GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
];

let photoIndex = 0;
let galleryIndex = 0;

export const DeviceService = {
  // Permission Override toggles for lab evaluation
  setCameraPermission(granted: boolean) {
    cameraPermissionGranted = granted;
  },
  getCameraPermission(): boolean {
    return cameraPermissionGranted;
  },

  setMediaLibraryPermission(granted: boolean) {
    mediaLibraryPermissionGranted = granted;
  },
  getMediaLibraryPermission(): boolean {
    return mediaLibraryPermissionGranted;
  },

  setLocationPermission(granted: boolean) {
    locationPermissionGranted = granted;
  },
  getLocationPermission(): boolean {
    return locationPermissionGranted;
  },

  setNotificationPermission(granted: boolean) {
    notificationPermissionGranted = granted;
  },
  getNotificationPermission(): boolean {
    return notificationPermissionGranted;
  },

  // ==========================================
  // ImagePicker Service (Steps 81, 82, 83)
  // ==========================================
  ImagePicker: {
    async requestCameraPermissionsAsync(): Promise<PermissionResponse> {
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 300));
      return {
        status: cameraPermissionGranted ? 'granted' : 'denied',
        granted: cameraPermissionGranted,
        canAskAgain: true,
      };
    },

    async launchCameraAsync(options?: any): Promise<ImagePickerResult> {
      if (!cameraPermissionGranted) {
        throw new Error('Camera permission not granted. Request permission before opening camera.');
      }
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 800));
      const uri = SAMPLE_PHOTOS[photoIndex % SAMPLE_PHOTOS.length];
      photoIndex++;
      return {
        canceled: false,
        assets: [
          {
            uri,
            width: 1080,
            height: 1440,
            type: 'image/jpeg',
            fileName: `camera_capture_${Date.now()}.jpg`,
            fileSize: 1024 * 750,
          },
        ],
      };
    },

    async requestMediaLibraryPermissionsAsync(): Promise<PermissionResponse> {
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 300));
      return {
        status: mediaLibraryPermissionGranted ? 'granted' : 'denied',
        granted: mediaLibraryPermissionGranted,
        canAskAgain: true,
      };
    },

    async launchImageLibraryAsync(options?: any): Promise<ImagePickerResult> {
      if (!mediaLibraryPermissionGranted) {
        throw new Error('Media library permission not granted.');
      }
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 600));
      const uri = SAMPLE_GALLERY_IMAGES[galleryIndex % SAMPLE_GALLERY_IMAGES.length];
      galleryIndex++;
      return {
        canceled: false,
        assets: [
          {
            uri,
            width: 1200,
            height: 800,
            type: 'image/jpeg',
            fileName: `gallery_image_${Date.now()}.jpg`,
            fileSize: 1024 * 920,
          },
        ],
      };
    },
  },

  // ==========================================
  // Geolocation Service (Step 84)
  // ==========================================
  Location: {
    async requestForegroundPermissionsAsync(): Promise<PermissionResponse> {
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 300));
      return {
        status: locationPermissionGranted ? 'granted' : 'denied',
        granted: locationPermissionGranted,
        canAskAgain: true,
      };
    },

    async getCurrentPositionAsync(options?: any): Promise<LocationData> {
      if (!locationPermissionGranted) {
        throw new Error('Location permission denied. User did not allow foreground location access.');
      }

      await new Promise<void>((resolve) => setTimeout(() => resolve(), 700));

      // Slightly perturb coordinates for live reading effect
      const deltaLat = (Math.random() - 0.5) * 0.002;
      const deltaLng = (Math.random() - 0.5) * 0.002;

      // Default realistic coordinates (e.g. Pune/Mumbai college tech campus coords)
      return {
        coords: {
          latitude: +(18.5204 + deltaLat).toFixed(6),
          longitude: +(73.8567 + deltaLng).toFixed(6),
          altitude: 560.4,
          accuracy: +(5 + Math.random() * 8).toFixed(1),
          speed: +(Math.random() * 1.5).toFixed(1),
        },
        timestamp: Date.now(),
      };
    },
  },

  // ==========================================
  // Push Notifications Service (Steps 85, 86)
  // ==========================================
  Notifications: {
    async requestPermissionsAsync(): Promise<PermissionResponse> {
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 300));
      return {
        status: notificationPermissionGranted ? 'granted' : 'denied',
        granted: notificationPermissionGranted,
        canAskAgain: true,
      };
    },

    async getExpoPushTokenAsync(): Promise<{ data: string }> {
      if (!notificationPermissionGranted) {
        throw new Error('Notification permissions not granted.');
      }
      return {
        data: 'ExponentPushToken[' + Math.random().toString(36).substring(2, 14) + ']',
      };
    },

    async scheduleNotificationAsync(request: NotificationRequest): Promise<string> {
      if (!notificationPermissionGranted) {
        throw new Error('Cannot schedule notification: Notification permission was denied.');
      }

      const id = 'notif_' + Date.now();
      const delayMs = (request.trigger?.seconds || 3) * 1000;

      // Trigger notification after specified seconds
      setTimeout(() => {
        const notifPayload = {
          request: { content: request.content },
          date: Date.now(),
        };

        // Notify all registered foreground listeners
        notificationListeners.forEach((listener) => {
          try {
            listener(notifPayload);
          } catch (e) {
            console.error('Notification listener callback error:', e);
          }
        });

        // Trigger native alert
        Alert.alert(
          `🔔 ${request.content.title}`,
          request.content.body,
          [{ text: 'Dismiss', style: 'default' }]
        );
      }, delayMs);

      return id;
    },

    addNotificationReceivedListener(listener: NotificationListener): { remove: () => void } {
      notificationListeners.push(listener);
      return {
        remove: () => {
          const index = notificationListeners.indexOf(listener);
          if (index !== -1) {
            notificationListeners.splice(index, 1);
          }
        },
      };
    },
  },
};

export default DeviceService;
