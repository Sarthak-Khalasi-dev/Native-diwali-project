import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import Input from '../common/Input';
import Button from '../common/Button';
import api from '../../services/api';

const CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Transportation',
  'Housing & Rent',
  'Bills & Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education',
  'Salary',
  'Investments',
  'Freelance / Side Gig',
  'Other',
];

const PAYMENT_METHODS = ['UPI / QR', 'Cash', 'Credit / Debit Card', 'Net Banking', 'Other'];

export default function ExpenseModal({ visible, onClose, onSaved, initialExpense = null }) {
  const [type, setType] = useState(initialExpense?.type || 'expense');
  const [title, setTitle] = useState(initialExpense?.title || '');
  const [amount, setAmount] = useState(initialExpense ? String(initialExpense.amount) : '');
  const [category, setCategory] = useState(initialExpense?.category || 'Food & Dining');
  const [paymentMethod, setPaymentMethod] = useState(initialExpense?.paymentMethod || 'UPI / QR');
  const [notes, setNotes] = useState(initialExpense?.notes || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset or initialize state when opening modal
  React.useEffect(() => {
    if (visible) {
      setType(initialExpense?.type || 'expense');
      setTitle(initialExpense?.title || '');
      setAmount(initialExpense ? String(initialExpense.amount) : '');
      setCategory(initialExpense?.category || (type === 'income' ? 'Salary' : 'Food & Dining'));
      setPaymentMethod(initialExpense?.paymentMethod || 'UPI / QR');
      setNotes(initialExpense?.notes || '');
      setErrors({});
    }
  }, [visible, initialExpense]);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!amount.trim()) {
      errs.amount = 'Amount is required';
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      errs.amount = 'Please enter a valid amount > 0';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        amount: parseFloat(amount),
        type,
        category,
        paymentMethod,
        notes: notes.trim(),
      };

      if (initialExpense?._id) {
        await api.expenses.update(initialExpense._id, payload);
      } else {
        await api.expenses.create(payload);
      }

      onSaved?.();
      onClose();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {initialExpense ? 'Edit Transaction' : 'Add Transaction'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Type Switcher: Expense / Income */}
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeBtn, type === 'expense' && styles.typeBtnActiveExpense]}
                onPress={() => {
                  setType('expense');
                  if (category === 'Salary') setCategory('Food & Dining');
                }}
              >
                <Ionicons
                  name="arrow-down-circle-outline"
                  size={18}
                  color={type === 'expense' ? COLORS.white : COLORS.textMuted}
                />
                <Text
                  style={[
                    styles.typeBtnText,
                    type === 'expense' && styles.typeBtnTextActive,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, type === 'income' && styles.typeBtnActiveIncome]}
                onPress={() => {
                  setType('income');
                  setCategory('Salary');
                }}
              >
                <Ionicons
                  name="arrow-up-circle-outline"
                  size={18}
                  color={type === 'income' ? COLORS.white : COLORS.textMuted}
                />
                <Text
                  style={[
                    styles.typeBtnText,
                    type === 'income' && styles.typeBtnTextActive,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* Title & Amount Inputs */}
            <Input
              label="Title"
              placeholder="e.g. Groceries, Zomato, Rent"
              value={title}
              onChangeText={setTitle}
              error={errors.title}
            />

            <Input
              label="Amount"
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              error={errors.amount}
            />

            {/* Category Selector */}
            <Text style={styles.inputLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.pill, category === cat && styles.pillActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      category === cat && styles.pillTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Payment Method */}
            <Text style={styles.inputLabel}>Payment Method</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
              {PAYMENT_METHODS.map((pm) => (
                <TouchableOpacity
                  key={pm}
                  style={[styles.pill, paymentMethod === pm && styles.pillActive]}
                  onPress={() => setPaymentMethod(pm)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      paymentMethod === pm && styles.pillTextActive,
                    ]}
                  >
                    {pm}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Notes */}
            <Input
              label="Notes (Optional)"
              placeholder="Add extra details or reference tags..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={2}
            />

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={onClose}
                style={styles.cancelBtn}
              />
              <Button
                title={initialExpense ? 'Update' : 'Save'}
                variant="primary"
                loading={loading}
                onPress={handleSubmit}
                style={styles.submitBtn}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '90%',
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
  scrollBody: {
    paddingBottom: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  typeBtnActiveExpense: {
    backgroundColor: COLORS.danger,
  },
  typeBtnActiveIncome: {
    backgroundColor: COLORS.success,
  },
  typeBtnText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  typeBtnTextActive: {
    color: COLORS.white,
  },
  inputLabel: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: 4,
  },
  pillsScroll: {
    marginBottom: 16,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  pillTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
  },
  submitBtn: {
    flex: 2,
  },
});
