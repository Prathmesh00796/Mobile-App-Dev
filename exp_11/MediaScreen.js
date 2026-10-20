import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import DeviceService from './deviceServices';

const ImagePicker = DeviceService.ImagePicker;

const MediaScreen = () => {
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [imageMetadata, setImageMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Permission test toggles
  const [cameraPerm, setCameraPerm] = useState(DeviceService.getCameraPermission());
  const [galleryPerm, setGalleryPerm] = useState(DeviceService.getMediaLibraryPermission());

  const toggleCameraPerm = () => {
    const next = !cameraPerm;
    DeviceService.setCameraPermission(next);
    setCameraPerm(next);
  };

  const toggleGalleryPerm = () => {
    const next = !galleryPerm;
    DeviceService.setMediaLibraryPermission(next);
    setGalleryPerm(next);
  };

  // Step 82: For 'Take Photo', request camera permission using
  // ImagePicker.requestCameraPermissionsAsync(), then call ImagePicker.launchCameraAsync()
  // and display the returned image URI using an Image component.
  const handleTakePhoto = async () => {
    setErrorMessage(null);
    setLoading(true);

    try {
      // 1. Request runtime camera permission
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        const msg = 'Camera permission denied! You must allow camera access to take pictures.';
        setErrorMessage(msg);
        Alert.alert('Permission Denied', msg);
        return;
      }

      // 2. Launch Camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      // 3. Display captured image URI
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedImageUri(asset.uri);
        setImageMetadata({
          source: 'camera',
          width: asset.width,
          height: asset.height,
          fileName: asset.fileName,
        });
      }
    } catch (err) {
      console.warn('Take Photo error:', err);
      const msg = err.message || 'Error occurred while accessing camera.';
      setErrorMessage(msg);
      Alert.alert('Camera Error', msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 83: For 'Choose from Gallery', request media-library permission and call
  // ImagePicker.launchImageLibraryAsync(), again displaying the selected image.
  const handleChooseFromGallery = async () => {
    setErrorMessage(null);
    setLoading(true);

    try {
      // 1. Request media library permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        const msg = 'Media library permission denied! Cannot access device photo gallery.';
        setErrorMessage(msg);
        Alert.alert('Permission Denied', msg);
        return;
      }

      // 2. Launch Image Library
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      // 3. Display selected image URI
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedImageUri(asset.uri);
        setImageMetadata({
          source: 'gallery',
          width: asset.width,
          height: asset.height,
          fileName: asset.fileName,
        });
      }
    } catch (err) {
      console.warn('Gallery error:', err);
      const msg = err.message || 'Error occurred while picking image from gallery.';
      setErrorMessage(msg);
      Alert.alert('Gallery Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Step 87: Permission Testing Controls */}
      <View style={styles.permissionCard}>
        <Text style={styles.permTitle}>⚙️ Runtime Permission Toggles (Test Step 87)</Text>
        <Text style={styles.permSub}>Toggle permissions below to verify graceful fallback on denial:</Text>

        <View style={styles.permRow}>
          <Text style={styles.permLabel}>Camera Permission:</Text>
          <TouchableOpacity
            style={[styles.permButton, cameraPerm ? styles.permGranted : styles.permDenied]}
            onPress={toggleCameraPerm}
          >
            <Text style={styles.permButtonText}>{cameraPerm ? '✓ GRANTED' : '✕ DENIED'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.permRow}>
          <Text style={styles.permLabel}>Media Library Permission:</Text>
          <TouchableOpacity
            style={[styles.permButton, galleryPerm ? styles.permGranted : styles.permDenied]}
            onPress={toggleGalleryPerm}
          >
            <Text style={styles.permButtonText}>{galleryPerm ? '✓ GRANTED' : '✕ DENIED'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Error Message Notice */}
      {errorMessage && (
        <View style={styles.errorNotice}>
          <Text style={styles.errorNoticeText}>⚠️ {errorMessage}</Text>
        </View>
      )}

      {/* Image Preview Box */}
      <View style={styles.previewCard}>
        <Text style={styles.previewHeading}>Captured / Selected Image</Text>
        {loading ? (
          <View style={styles.placeholderBox}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.placeholderText}>Launching device media hardware...</Text>
          </View>
        ) : selectedImageUri ? (
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: selectedImageUri }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.badgeRow}>
              <View style={styles.sourceBadge}>
                <Text style={styles.sourceBadgeText}>
                  Source: {imageMetadata?.source?.toUpperCase()}
                </Text>
              </View>
              {imageMetadata?.width && (
                <View style={styles.metaBadge}>
                  <Text style={styles.metaBadgeText}>
                    {imageMetadata.width} × {imageMetadata.height}px
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <Text style={styles.placeholderText}>No image selected yet.</Text>
            <Text style={styles.placeholderSub}>
              Use the buttons below to capture from camera or choose from your gallery.
            </Text>
          </View>
        )}
      </View>

      {/* Step 81: Two Buttons: 'Take Photo' and 'Choose from Gallery' */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cameraButton]}
          onPress={handleTakePhoto}
          disabled={loading}
        >
          <Text style={styles.buttonEmoji}>📸</Text>
          <Text style={styles.buttonText}>Take Photo</Text>
          <Text style={styles.buttonSubText}>ImagePicker.launchCameraAsync</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.galleryButton]}
          onPress={handleChooseFromGallery}
          disabled={loading}
        >
          <Text style={styles.buttonEmoji}>🖼️</Text>
          <Text style={styles.buttonText}>Choose from Gallery</Text>
          <Text style={styles.buttonSubText}>launchImageLibraryAsync</Text>
        </TouchableOpacity>
      </View>

      {/* Code Signature Box */}
      <View style={styles.codeBox}>
        <Text style={styles.codeTitle}>💻 Procedure Steps 82 & 83</Text>
        <Text style={styles.codeText}>
          {`// 1. Request permission\nconst { granted } = await ImagePicker.requestCameraPermissionsAsync();\n// 2. Launch Camera\nif (granted) {\n  const result = await ImagePicker.launchCameraAsync();\n  setImageUri(result.assets[0].uri);\n}`}
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
    marginVertical: 4,
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
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  previewHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  placeholderBox: {
    height: 220,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  placeholderIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  placeholderSub: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
  imageWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sourceBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sourceBadgeText: {
    color: '#1D4ED8',
    fontSize: 11,
    fontWeight: '700',
  },
  metaBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  metaBadgeText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cameraButton: {
    backgroundColor: '#2563EB',
  },
  galleryButton: {
    backgroundColor: '#0D9488',
  },
  buttonEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  buttonSubText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
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

export default MediaScreen;
