import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

export default function Badge({
  text,
  variant = 'primary', // 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'muted'
  size = 'md',        // 'sm' | 'md'
  style,
  textStyle,
}) {
  const getBadgeColors = () => {
    switch (variant) {
      case 'success':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: COLORS.success, border: 'rgba(16, 185, 129, 0.3)' };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: COLORS.warning, border: 'rgba(245, 158, 11, 0.3)' };
      case 'danger':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: COLORS.danger, border: 'rgba(239, 68, 68, 0.3)' };
      case 'info':
        return { bg: 'rgba(6, 182, 212, 0.15)', text: COLORS.secondary, border: 'rgba(6, 182, 212, 0.3)' };
      case 'muted':
        return { bg: 'rgba(100, 116, 139, 0.15)', text: COLORS.textMuted, border: 'rgba(100, 116, 139, 0.3)' };
      case 'primary':
      default:
        return { bg: 'rgba(99, 102, 241, 0.15)', text: COLORS.primary, border: 'rgba(99, 102, 241, 0.3)' };
    }
  };

  const colors = getBadgeColors();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg, borderColor: colors.border },
        size === 'sm' && styles.badgeSm,
        style,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          { color: colors.text },
          size === 'sm' && styles.textSm,
          textStyle,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: SIZES.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  textSm: {
    fontSize: 10,
  },
});
