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

const CATEGORIES = ['Flatmates / Home', 'Trip & Vacation', 'Couple / Friends', 'Event / Party', 'Work', 'Other'];

export default function CreateGroupModal({ visible, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Flatmates / Home');
  const [memberEmailInput, setMemberEmailInput] = useState('');
  const [memberEmails, setMemberEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (visible) {
      setName('');
      setDescription('');
      setCategory('Flatmates / Home');
      setMemberEmailInput('');
      setMemberEmails([]);
      setErrors({});
    }
  }, [visible]);

  const handleAddEmail = () => {
    const email = memberEmailInput.trim().toLowerCase();
    if (!email) return;
    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (memberEmails.includes(email)) {
      Alert.alert('Duplicate', 'This email is already added to the list.');
      return;
    }
    setMemberEmails([...memberEmails, email]);
    setMemberEmailInput('');
  };

  const handleRemoveEmail = (targetEmail) => {
    setMemberEmails(memberEmails.filter((e) => e !== targetEmail));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrors({ name: 'Group name is required' });
      return;
    }

    setLoading(true);
    try {
      await api.groups.create({
        name: name.trim(),
        description: description.trim(),
        category,
        memberEmails,
      });

      onCreated?.();
      onClose();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to create group');
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
            <Text style={styles.headerTitle}>Create Split Group</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            <Input
              label="Group Name"
              placeholder="e.g. Goa Trip 2026, Flat 402, Office Lunch"
              value={name}
              onChangeText={setName}
              error={errors.name}
            />

            <Input
              label="Description (Optional)"
              placeholder="What is this group for?"
              value={description}
              onChangeText={setDescription}
            />

            {/* Category selection */}
            <Text style={styles.label}>Group Type</Text>
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

            {/* Add Members by Email */}
            <Text style={styles.label}>Add Members by Email</Text>
            <View style={styles.addMemberRow}>
              <View style={{ flex: 1 }}>
                <Input
                  placeholder="friend@splitflow.com"
                  value={memberEmailInput}
                  onChangeText={setMemberEmailInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity style={styles.addEmailBtn} onPress={handleAddEmail}>
                <Ionicons name="person-add" size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            {memberEmails.length > 0 && (
              <View style={styles.emailsContainer}>
                {memberEmails.map((email) => (
                  <View key={email} style={styles.emailBadge}>
                    <Text style={styles.emailText}>{email}</Text>
                    <TouchableOpacity onPress={() => handleRemoveEmail(email)}>
                      <Ionicons name="close-circle" size={16} color={COLORS.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.actionRow}>
              <Button title="Cancel" variant="outline" onPress={onClose} style={styles.btnFlex} />
              <Button
                title="Create Group"
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
  addMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addEmailBtn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  emailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  emailText: {
    fontSize: SIZES.xs,
    color: COLORS.text,
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
