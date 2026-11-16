import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

export default function Button({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryBtn;
      case 'outline':
        return styles.outlineBtn;
      case 'danger':
        return styles.dangerBtn;
      case 'ghost':
        return styles.ghostBtn;
      case 'primary':
      default:
        return styles.primaryBtn;
    }
  };

  const getVariantTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'danger':
        return styles.dangerText;
      case 'ghost':
        return styles.ghostText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.sizeSm;
      case 'lg':
        return styles.sizeLg;
      case 'md':
      default:
        return styles.sizeMd;
    }
  };

  const isInteractive = !loading && !disabled;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={isInteractive ? onPress : undefined}
      disabled={!isInteractive}
      style={[
        styles.baseButton,
        getVariantStyle(),
        getSizeStyle(),
        disabled && styles.disabledBtn,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && <View style={styles.leftIcon}>{icon}</View>}
          <Text style={[styles.baseText, getVariantTextStyle(), textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && <View style={styles.rightIcon}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  baseText: {
    fontWeight: '700',
    fontSize: SIZES.base,
    letterSpacing: 0.3,
  },

  // Sizes
  sizeSm: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  sizeMd: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  sizeLg: {
    paddingVertical: 18,
    paddingHorizontal: 24,
  },

  // Variants
  primaryBtn: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryText: {
    color: COLORS.white,
  },

  secondaryBtn: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  secondaryText: {
    color: COLORS.text,
  },

  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  outlineText: {
    color: COLORS.primary,
  },

  dangerBtn: {
    backgroundColor: COLORS.danger,
  },
  dangerText: {
    color: COLORS.white,
  },

  ghostBtn: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: COLORS.textSecondary,
  },

  disabledBtn: {
    opacity: 0.5,
  },
});
