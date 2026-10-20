import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { COLORS, FONT_SIZES, RADIUS, SPACING } from '../theme';

interface CustomInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  icon?: string;
  containerStyle?: ViewStyle;
  primaryColor?: string; // Optional dynamic override
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  helperText,
  error,
  icon,
  containerStyle,
  primaryColor,
  secureTextEntry,
  keyboardType = 'default',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const activeColor = primaryColor || COLORS.primary;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Input container */}
      <View
        style={[
          styles.inputWrapper,
          isFocused && { borderColor: activeColor, borderWidth: 1.5 },
          !!error && { borderColor: COLORS.danger, borderWidth: 1.5 },
        ]}
      >
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.input, icon ? { paddingLeft: SPACING.xs } : null]}
          {...props}
        />
      </View>

      {/* Error or Helper text */}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs + 2,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm + 4,
    minHeight: 46,
  },
  icon: {
    fontSize: FONT_SIZES.md,
    marginRight: SPACING.xs,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    paddingVertical: SPACING.sm,
  },
  helperText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.danger,
    marginTop: 4,
    fontWeight: '500',
  },
});
