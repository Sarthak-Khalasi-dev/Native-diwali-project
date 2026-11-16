import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

export default function Card({ children, style, variant = 'default' }) {
  return (
    <View
      style={[
        styles.baseCard,
        variant === 'elevated' && styles.elevatedCard,
        variant === 'flat' && styles.flatCard,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  baseCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius + 4,
    padding: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 14,
  },
  elevatedCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  flatCard: {
    borderWidth: 0,
    backgroundColor: '#1E293B',
  },
});
