import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const CURRENCIES = [
  { symbol: '₹', code: 'INR', label: '₹ INR' },
  { symbol: '$', code: 'USD', label: '$ USD' },
  { symbol: '€', code: 'EUR', label: '€ EUR' },
  { symbol: '£', code: 'GBP', label: '£ GBP' },
];

export default function EditProfileModal({ visible, onClose, onUpdated }) {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [monthlyBudget, setMonthlyBudget] = useState(user?.monthlyBudget ? String(user.monthlyBudget) : '25000');
  const [currency, setCurrency] = useState(user?.currency || '₹');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (visible && user) {
      setName(user.name || '');
      setMonthlyBudget(user.monthlyBudget ? String(user.monthlyBudget) : '25000');
      setCurrency(user.currency || '₹');
    }
  }, [visible, user]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Name cannot be empty.');
      return;
    }
    const budgetNum = parseFloat(monthlyBudget);
    if (isNaN(budgetNum) || budgetNum < 0) {
      Alert.alert('Invalid Budget', 'Please enter a valid monthly budget amount.');
      return;
    }

    setLoading(true);
    try {
      const res = await updateProfile({
        name: name.trim(),
        monthlyBudget: budgetNum,
        currency,
      });
      if (res.success) {
        Alert.alert('Success', 'Profile preferences updated!');
        onUpdated?.();
        onClose();
      } else {
        Alert.alert('Update Failed', res.error || 'Could not update profile');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Profile & Budget</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
          />

          <Input
            label="Monthly Target Budget"
            value={monthlyBudget}
            onChangeText={setMonthlyBudget}
            keyboardType="numeric"
            placeholder="25000"
          />

          <Text style={styles.currencyLabel}>Preferred Currency</Text>
          <View style={styles.currencyRow}>
            {CURRENCIES.map((cur) => (
              <TouchableOpacity
                key={cur.symbol}
                style={[
                  styles.currencyPill,
                  currency === cur.symbol && styles.currencyPillActive,
                ]}
                onPress={() => setCurrency(cur.symbol)}
              >
                <Text
                  style={[
                    styles.currencyPillText,
                    currency === cur.symbol && styles.currencyPillTextActive,
                  ]}
                >
                  {cur.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.actions}>
            <Button title="Cancel" variant="outline" onPress={onClose} style={styles.btnFlex} />
            <Button
              title="Save Changes"
              variant="primary"
              loading={loading}
              onPress={handleSave}
              style={[styles.btnFlex, { flex: 1.5 }]}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeBtn: {
    padding: 6,
  },
  currencyLabel: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: 4,
  },
  currencyRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  currencyPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  currencyPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  currencyPillText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  currencyPillTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  btnFlex: {
    flex: 1,
  },
});
