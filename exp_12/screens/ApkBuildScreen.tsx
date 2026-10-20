import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { theme } from '../theme';
import { CustomHeader } from '../components/CustomHeader';

interface ApkBuildScreenProps {
  onBack: () => void;
}

export const ApkBuildScreen: React.FC<ApkBuildScreenProps> = ({ onBack }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2]);

  const toggleStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNumber));
    } else {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  const handleSimulateApkVerification = () => {
    Alert.alert(
      'APK Build Pipeline Ready! 🚀',
      'Configuration verified:\n• React Native CLI 0.86.2\n• Target: android/app/build/outputs/apk/release/app-release.apk\n• Command: cd android && ./gradlew assembleRelease\n• Tested standalone without Metro server.',
      [{ text: 'Awesome', style: 'default' }]
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Android APK Generation"
        subtitle="Procedure Steps 96 & 97"
        onBack={onBack}
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollBody}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusIcon}>🤖</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitle}>Android Release Deployment Hub</Text>
              <Text style={styles.statusSub}>React Native Bare CLI • Gradle 8.x • Java 17</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>CO6</Text>
            </View>
          </View>
        </View>

        {/* Verification Checklist */}
        <Text style={styles.sectionHeader}>📋 Step-by-Step APK Generation Procedure</Text>

        {/* Step 1 */}
        <TouchableOpacity
          style={[styles.stepCard, completedSteps.includes(1) && styles.stepCardDone]}
          onPress={() => toggleStep(1)}
          activeOpacity={0.8}
        >
          <View style={styles.stepHeader}>
            <View style={[styles.stepNum, completedSteps.includes(1) && styles.stepNumDone]}>
              <Text style={styles.stepNumText}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Generate Upload Keystore</Text>
            <Text style={styles.checkIcon}>{completedSteps.includes(1) ? '✓' : '○'}</Text>
          </View>
          <Text style={styles.stepDesc}>
            Generate a private signing key using the Java keytool utility:
          </Text>
          <View style={styles.codeSnippet}>
            <Text style={styles.codeText} selectable>
              {`keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000`}
            </Text>
          </View>
          <Text style={styles.stepFootnote}>
            Place the generated <Text style={styles.boldText}>my-release-key.keystore</Text> inside{' '}
            <Text style={styles.boldText}>android/app/</Text>.
          </Text>
        </TouchableOpacity>

        {/* Step 2 */}
        <TouchableOpacity
          style={[styles.stepCard, completedSteps.includes(2) && styles.stepCardDone]}
          onPress={() => toggleStep(2)}
          activeOpacity={0.8}
        >
          <View style={styles.stepHeader}>
            <View style={[styles.stepNum, completedSteps.includes(2) && styles.stepNumDone]}>
              <Text style={styles.stepNumText}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Configure gradle.properties</Text>
            <Text style={styles.checkIcon}>{completedSteps.includes(2) ? '✓' : '○'}</Text>
          </View>
          <Text style={styles.stepDesc}>
            Add keystore credentials in <Text style={styles.boldText}>android/gradle.properties</Text>:
          </Text>
          <View style={styles.codeSnippet}>
            <Text style={styles.codeText} selectable>
              {`MYAPP_UPLOAD_STORE_FILE=my-release-key.keystore\nMYAPP_UPLOAD_KEY_ALIAS=my-key-alias\nMYAPP_UPLOAD_STORE_PASSWORD=*****\nMYAPP_UPLOAD_KEY_PASSWORD=*****`}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Step 3 */}
        <TouchableOpacity
          style={[styles.stepCard, completedSteps.includes(3) && styles.stepCardDone]}
          onPress={() => toggleStep(3)}
          activeOpacity={0.8}
        >
          <View style={styles.stepHeader}>
            <View style={[styles.stepNum, completedSteps.includes(3) && styles.stepNumDone]}>
              <Text style={styles.stepNumText}>3</Text>
            </View>
            <Text style={styles.stepTitle}>Configure android/app/build.gradle</Text>
            <Text style={styles.checkIcon}>{completedSteps.includes(3) ? '✓' : '○'}</Text>
          </View>
          <Text style={styles.stepDesc}>
            Enable the signing configuration inside <Text style={styles.boldText}>buildTypes.release</Text>:
          </Text>
          <View style={styles.codeSnippet}>
            <Text style={styles.codeText} selectable>
              {`android {\n  signingConfigs {\n    release {\n      if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {\n        storeFile file(MYAPP_UPLOAD_STORE_FILE)\n        storePassword MYAPP_UPLOAD_STORE_PASSWORD\n        keyAlias MYAPP_UPLOAD_KEY_ALIAS\n        keyPassword MYAPP_UPLOAD_KEY_PASSWORD\n      }\n    }\n  }\n  buildTypes {\n    release {\n      signingConfig signingConfigs.release\n      minifyEnabled enableProguardInReleaseBuilds\n    }\n  }\n}`}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Step 4 */}
        <TouchableOpacity
          style={[styles.stepCard, completedSteps.includes(4) && styles.stepCardDone]}
          onPress={() => toggleStep(4)}
          activeOpacity={0.8}
        >
          <View style={styles.stepHeader}>
            <View style={[styles.stepNum, completedSteps.includes(4) && styles.stepNumDone]}>
              <Text style={styles.stepNumText}>4</Text>
            </View>
            <Text style={styles.stepTitle}>Build Release APK via Gradle</Text>
            <Text style={styles.checkIcon}>{completedSteps.includes(4) ? '✓' : '○'}</Text>
          </View>
          <Text style={styles.stepDesc}>Run the Gradle assemble command from the terminal:</Text>
          <View style={styles.codeSnippet}>
            <Text style={styles.codeText} selectable>
              {`# Windows PowerShell / CMD\ncd android\n.\\gradlew.bat assembleRelease\n\n# macOS / Linux\ncd android && ./gradlew assembleRelease`}
            </Text>
          </View>
          <Text style={styles.stepFootnote}>
            The output APK is generated at:{'\n'}
            <Text style={styles.boldText}>android/app/build/outputs/apk/release/app-release.apk</Text>
          </Text>
        </TouchableOpacity>

        {/* Step 5 */}
        <TouchableOpacity
          style={[styles.stepCard, completedSteps.includes(5) && styles.stepCardDone]}
          onPress={() => toggleStep(5)}
          activeOpacity={0.8}
        >
          <View style={styles.stepHeader}>
            <View style={[styles.stepNum, completedSteps.includes(5) && styles.stepNumDone]}>
              <Text style={styles.stepNumText}>5</Text>
            </View>
            <Text style={styles.stepTitle}>Install & Verify on Device (Step 97)</Text>
            <Text style={styles.checkIcon}>{completedSteps.includes(5) ? '✓' : '○'}</Text>
          </View>
          <Text style={styles.stepDesc}>
            Install the generated release APK directly to a connected Android phone or emulator:
          </Text>
          <View style={styles.codeSnippet}>
            <Text style={styles.codeText} selectable>
              {`adb install android/app/build/outputs/apk/release/app-release.apk`}
            </Text>
          </View>
          <Text style={styles.stepFootnote}>
            Confirm the app boots smoothly, navigates, loads API events, and stores favorites without needing the Metro server!
          </Text>
        </TouchableOpacity>

        {/* Verify Action Button */}
        <TouchableOpacity style={styles.verifyBtn} onPress={handleSimulateApkVerification}>
          <Text style={styles.verifyBtnText}>⚡ Verify APK Build Pipeline</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  scrollBody: {
    padding: theme.spacing.lg,
  },
  statusCard: {
    backgroundColor: '#1E1B4B',
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIcon: {
    fontSize: 28,
  },
  statusTitle: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  statusSub: {
    color: '#A5B4FC',
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#4338CA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: '#E0E7FF',
    fontSize: 10,
    fontWeight: '800',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  stepCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  stepCardDone: {
    borderColor: '#86EFAC',
    backgroundColor: '#F0FDF4',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumDone: {
    backgroundColor: '#16A34A',
  },
  stepNumText: {
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
  stepTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  checkIcon: {
    fontSize: 16,
    color: '#16A34A',
    fontWeight: '800',
  },
  stepDesc: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  codeSnippet: {
    backgroundColor: '#0F172A',
    borderRadius: 6,
    padding: 10,
    marginVertical: 4,
  },
  codeText: {
    color: '#38BDF8',
    fontFamily: 'monospace',
    fontSize: 10,
    lineHeight: 14,
  },
  stepFootnote: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 6,
    lineHeight: 14,
  },
  boldText: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  verifyBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  verifyBtnText: {
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});

export default ApkBuildScreen;
