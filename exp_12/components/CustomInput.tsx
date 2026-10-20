import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { theme } from '../theme';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string | null;
  containerStyle?: ViewStyle;
  icon?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  containerStyle,
  icon,
  style,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error ? styles.inputError : null]}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <TextInput
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.input, style]}
          {...rest}
        />
      </View>
      {error && <Text style={styles.errorText}>⚠️ {error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.body,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: theme.colors.danger,
    backgroundColor: '#FFF5F5',
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  errorText: {
    fontSize: theme.typography.small,
    color: theme.colors.danger,
    marginTop: 4,
    fontWeight: '600',
  },
});

export default CustomInput;
