import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import Card from './Card';

export default function StatCard({
  title,
  amount,
  currency = '₹',
  subtitle,
  type = 'neutral', // 'income' | 'expense' | 'neutral' | 'balance'
  icon,
  style,
}) {
  const getAmountColor = () => {
    switch (type) {
      case 'income':
        return COLORS.income;
      case 'expense':
        return COLORS.expense;
      case 'balance':
        return COLORS.secondary;
      case 'neutral':
      default:
        return COLORS.text;
    }
  };

  return (
    <Card style={[styles.statCard, style]} variant="elevated">
      <View style={styles.headerRow}>
        <Text style={styles.titleText}>{title}</Text>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>

      <Text style={[styles.amountText, { color: getAmountColor() }]}>
        {type === 'expense' && amount > 0 ? '-' : ''}
        {currency} {typeof amount === 'number' ? amount.toLocaleString('en-IN') : amount}
      </Text>

      {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
    </Card>
  );
}

const styles = StyleSheet.create({
  statCard: {
    padding: 16,
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconContainer: {
    padding: 4,
  },
  amountText: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
  },
});
