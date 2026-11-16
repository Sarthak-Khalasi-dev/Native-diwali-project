import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  helperText,
  keyboardType = 'default',
  autoCapitalize = 'none',
  leftIcon,
  rightIcon,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  editable = true,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const shouldHideText = secureTextEntry && !isPasswordVisible;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.focusedWrapper,
          error && styles.errorWrapper,
          !editable && styles.disabledWrapper,
          multiline && { minHeight: 90, alignItems: 'flex-start' },
        ]}
      >
        {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={shouldHideText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.textInput,
            multiline && { textAlignVertical: 'top', paddingTop: 10 },
            inputStyle,
          ]}
        />

        {secureTextEntry ? (
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.eyeText}>{isPasswordVisible ? '🙈 Hide' : '👁️ Show'}</Text>
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIconWrapper}>{rightIcon}</View>
        ) : null}
      </View>

      {error ? (
        <Text style={styles.errorText}>⚠️ {error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 14,
    minHeight: 50,
  },
  focusedWrapper: {
    borderColor: COLORS.primary,
    backgroundColor: '#1E293B',
  },
  errorWrapper: {
    borderColor: COLORS.danger,
  },
  disabledWrapper: {
    opacity: 0.6,
    backgroundColor: '#0F172A',
  },
  leftIconWrapper: {
    marginRight: 10,
  },
  rightIconWrapper: {
    marginLeft: 10,
  },
  textInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.md,
    paddingVertical: 12,
  },
  eyeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  eyeText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: SIZES.xs,
    marginTop: 4,
    fontWeight: '500',
  },
  helperText: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
    marginTop: 4,
  },
});
