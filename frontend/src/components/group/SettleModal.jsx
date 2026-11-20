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

const PAYMENT_METHODS = ['UPI / GPay / PhonePe', 'Cash', 'Net Banking', 'Other'];

export default function SettleModal({ visible, group, balances = [], currentUserId, onClose, onSettled }) {
  const [selectedPayeeId, setSelectedPayeeId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / GPay / PhonePe');
  const [notes, setNotes] = useState('Settled via SplitFlow');
  const [loading, setLoading] = useState(false);

  // Other members in this group that the current user can settle with
  const eligiblePayees = balances.filter(
    (b) => b.user && b.user._id && b.user._id.toString() !== currentUserId
  );

  React.useEffect(() => {
    if (visible) {
      if (eligiblePayees.length > 0) {
        setSelectedPayeeId(eligiblePayees[0].user._id);
        // Default amount could be positive balance if available
        const payee = eligiblePayees[0];
        if (payee.netBalance > 0) {
          setAmount(String(Math.abs(payee.netBalance)));
        } else {
          setAmount('');
        }
      } else {
        setSelectedPayeeId('');
        setAmount('');
      }
      setPaymentMethod('UPI / GPay / PhonePe');
      setNotes('Settled via SplitFlow');
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!selectedPayeeId) {
      Alert.alert('Required', 'Please select a member to settle with.');
      return;
    }
    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount > 0.');
      return;
    }

    setLoading(true);
    try {
      await api.groups.settleUp(group._id, {
        payeeId: selectedPayeeId,
        amount: parseFloat(amount),
        paymentMethod,
        notes,
      });

      onSettled?.();
      onClose();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to record settlement');
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
            <Text style={styles.headerTitle}>Settle Up Debt</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Payee Selection */}
            <Text style={styles.label}>Select Member to Pay</Text>
            <View style={styles.payeesContainer}>
              {eligiblePayees.map((b) => (
                <TouchableOpacity
                  key={b.user._id}
                  style={[
                    styles.payeeCard,
                    selectedPayeeId === b.user._id && styles.payeeCardActive,
                  ]}
                  onPress={() => setSelectedPayeeId(b.user._id)}
                >
                  <Ionicons
                    name="person-circle-outline"
                    size={28}
                    color={selectedPayeeId === b.user._id ? COLORS.primary : COLORS.textMuted}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.payeeName}>{b.user.name}</Text>
                    <Text style={styles.payeeEmail}>{b.user.email}</Text>
                  </View>
                  {selectedPayeeId === b.user._id && (
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Settlement Amount"
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            {/* Payment Method */}
            <Text style={styles.label}>Payment Method</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
              {PAYMENT_METHODS.map((pm) => (
                <TouchableOpacity
                  key={pm}
                  style={[styles.pill, paymentMethod === pm && styles.pillActive]}
                  onPress={() => setPaymentMethod(pm)}
                >
                  <Text style={[styles.pillText, paymentMethod === pm && styles.pillTextActive]}>
                    {pm}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Input
              label="Note (Optional)"
              placeholder="UPI Reference or note"
              value={notes}
              onChangeText={setNotes}
            />

            <View style={styles.actionRow}>
              <Button title="Cancel" variant="outline" onPress={onClose} style={styles.btnFlex} />
              <Button
                title="Record Settlement"
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
  label: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: 4,
  },
  payeesContainer: {
    gap: 8,
    marginBottom: 16,
  },
  payeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  payeeCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  payeeName: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  payeeEmail: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
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
