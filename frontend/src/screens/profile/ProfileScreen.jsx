import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EditProfileModal from '../../components/profile/EditProfileModal';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Avatar Card */}
        <Card style={styles.profileCard} variant="elevated">
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User Profile'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.badgeRow}>
            <Badge text="Personal Account" variant="primary" size="sm" />
            <Badge text={`Currency: ${user?.currency || '₹'}`} variant="info" size="sm" />
          </View>
        </Card>

        {/* Budget Setting Card */}
        <Card style={styles.sectionCard} variant="flat">
          <View style={styles.prefHeader}>
            <Text style={styles.sectionTitle}>Budget Preferences</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editBtn}>
              <Ionicons name="pencil" size={14} color={COLORS.primary} />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.prefRow}>
            <View style={styles.prefLeft}>
              <Ionicons name="cash-outline" size={20} color={COLORS.primary} style={{ marginRight: 10 }} />
              <Text style={styles.prefLabel}>Monthly Target Budget</Text>
            </View>
            <Text style={styles.prefValue}>
              {user?.currency || '₹'} {(user?.monthlyBudget || 25000).toLocaleString('en-IN')}
            </Text>
          </View>
        </Card>

        {/* App Info Card */}
        <Card style={styles.sectionCard} variant="flat">
          <Text style={styles.sectionTitle}>App Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Name</Text>
            <Text style={styles.infoValue}>SplitFlow Mobile</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Framework</Text>
            <Text style={styles.infoValue}>React Native (Expo SDK 52)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Navigation</Text>
            <Text style={styles.infoValue}>React Navigation 7 (Tabs & Stacks)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Author</Text>
            <Text style={styles.infoValue}>Sarthak Khalasi</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Milestone Status</Text>
            <Text style={[styles.infoValue, { color: COLORS.success, fontWeight: '700' }]}>
              Day 7 / 21 Nov Complete (Production Ready)
            </Text>
          </View>
        </Card>

        {/* Logout Button */}
        <Button
          title="Sign Out of SplitFlow"
          onPress={logout}
          variant="danger"
          icon={<Ionicons name="log-out-outline" size={20} color={COLORS.white} />}
          style={styles.logoutBtn}
        />
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '800',
  },
  userName: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionCard: {
    padding: 16,
    marginBottom: 14,
  },
  prefHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  editBtnText: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    fontWeight: '700',
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prefLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefLabel: {
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  prefValue: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  logoutBtn: {
    marginTop: 12,
  },
});
