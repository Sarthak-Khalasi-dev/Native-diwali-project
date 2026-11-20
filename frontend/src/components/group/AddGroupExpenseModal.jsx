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

const CATEGORIES = ['Dining Out', 'Groceries', 'Rent & Utilities', 'Travel / Fuel', 'Entertainment', 'General'];

export default function AddGroupExpenseModal({ visible, group, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Dining Out');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (visible) {
      setTitle('');
      setAmount('');
      setCategory('Dining Out');
      setErrors({});
    }
  }, [visible]);

  const memberCount = group?.members?.length || 1;
  const perPerson = amount && !isNaN(Number(amount)) && Number(amount) > 0
    ? (Number(amount) / memberCount).toFixed(2)
    : '0.00';

  const handleSubmit = async () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      errs.amount = 'Valid amount > 0 is required';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await api.groups.addExpense(group._id, {
        title: title.trim(),
        amount: parseFloat(amount),
        category,
        splitType: 'equal',
      });

      onCreated?.();
      onClose();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to record group expense');
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
            <Text style={styles.headerTitle}>Add Bill to {group?.name || 'Group'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            <Input
              label="Description / Purpose"
              placeholder="e.g. Dinner at Socials, Groceries, Electricity bill"
              value={title}
              onChangeText={setTitle}
              error={errors.title}
            />

            <Input
              label="Total Bill Amount"
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              error={errors.amount}
            />

            {/* Split Info Card */}
            <View style={styles.splitInfoCard}>
              <Ionicons name="git-branch-outline" size={20} color={COLORS.secondary} />
              <View style={styles.splitInfoTextCol}>
                <Text style={styles.splitInfoTitle}>Equal Split ({memberCount} members)</Text>
                <Text style={styles.splitInfoValue}>
                  Each person owes: <Text style={{ color: COLORS.secondary, fontWeight: '700' }}>₹{perPerson}</Text>
                </Text>
              </View>
            </View>

            {/* Category selection */}
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.pill, category === cat && styles.pillActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.pillText, category === cat && styles.pillTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.actionRow}>
              <Button title="Cancel" variant="outline" onPress={onClose} style={styles.btnFlex} />
              <Button
                title="Split Bill"
                variant="primary"
                loading={loading}
                onPress={handleSubmit}
                style={[styles.btnFlex, { flex: 1.5 }]}
              />
            </View>
          </ScrollView>
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
    maxHeight: '88%',
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
  splitInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 12,
  },
  splitInfoTextCol: {
    flex: 1,
  },
  splitInfoTitle: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  splitInfoValue: {
    fontSize: SIZES.sm,
    color: COLORS.text,
    marginTop: 2,
  },
  label: {
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
  btnFlex: {
    flex: 1,
  },
});
