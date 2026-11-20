import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import AddGroupExpenseModal from '../../components/group/AddGroupExpenseModal';
import SettleModal from '../../components/group/SettleModal';

export default function GroupDetailScreen({ route, navigation }) {
  const { groupId, groupName } = route.params || {};
  const { user } = useAuth();

  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modals
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [settleModalVisible, setSettleModalVisible] = useState(false);

  const fetchGroupDetails = async () => {
    try {
      const res = await api.groups.getDetails(groupId);
      if (res.success && res.data) {
        setGroupData(res.data);
      }
    } catch (err) {
      console.warn('[GroupDetail] Error fetching details:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGroupDetails();
  };

  const group = groupData?.group;
  const expenses = groupData?.expenses || [];
  const settlements = groupData?.settlements || [];
  const balances = groupData?.balances || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {group?.name || groupName || 'Group Details'}
          </Text>
          <Text style={styles.headerCategory}>{group?.category || 'Shared Group'}</Text>
        </View>
        <TouchableOpacity
          style={styles.settleBtn}
          onPress={() => setSettleModalVisible(true)}
        >
          <Text style={styles.settleBtnText}>Settle Up</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollBody}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        >
          {/* Group Overview Banner */}
          <Card style={styles.bannerCard} variant="elevated">
            <View style={styles.bannerHeader}>
              <View style={styles.bannerIcon}>
                <Ionicons name="people" size={24} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>{group?.name}</Text>
                <Text style={styles.bannerDesc}>
                  {group?.description || 'No description provided'}
                </Text>
              </View>
              <Badge text={`${group?.members?.length || 0} Members`} variant="info" size="sm" />
            </View>

            {/* Quick Action Button */}
            <TouchableOpacity
              style={styles.addBillBtn}
              activeOpacity={0.8}
              onPress={() => setExpenseModalVisible(true)}
            >
              <Ionicons name="receipt-outline" size={18} color={COLORS.white} />
              <Text style={styles.addBillBtnText}>+ Add Group Expense</Text>
            </TouchableOpacity>
          </Card>

          {/* Member Balance Breakdown */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Net Balances</Text>
            <Text style={styles.sectionSubtitle}>Positive = is owed, Negative = owes</Text>
          </View>

          <View style={styles.balancesContainer}>
            {balances.map((b) => {
              const isCurrentUser = b.user?._id?.toString() === user?._id?.toString();
              const net = b.netBalance || 0;
              const isPositive = net > 0;
              const isZero = Math.abs(net) < 0.01;

              return (
                <Card key={b.user?._id} style={styles.balanceCard} variant="flat">
                  <View style={styles.balanceRow}>
                    <View style={styles.memberAvatar}>
                      <Text style={styles.avatarInitial}>
                        {(b.user?.name || 'U').charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.memberName}>
                        {b.user?.name || 'Member'}{' '}
                        {isCurrentUser && <Text style={styles.youTag}>(You)</Text>}
                      </Text>
                      <Text style={styles.memberEmail}>{b.user?.email}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text
                        style={[
                          styles.balanceAmount,
                          isZero
                            ? { color: COLORS.textMuted }
                            : isPositive
                            ? { color: COLORS.success }
                            : { color: COLORS.danger },
                        ]}
                      >
                        {isZero ? 'Settled' : `${isPositive ? '+' : '-'}₹${Math.abs(net).toFixed(2)}`}
                      </Text>
                      <Text style={styles.balanceStatusText}>
                        {isZero ? 'all good' : isPositive ? 'gets back' : 'owes'}
                      </Text>
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>

          {/* Group Expenses List */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shared Expenses ({expenses.length})</Text>
          </View>

          {expenses.length === 0 ? (
            <Card style={styles.emptyCard} variant="flat">
              <Ionicons name="receipt-outline" size={32} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No group bills added yet</Text>
              <Text style={styles.emptySubtitle}>Tap "+ Add Group Expense" above to split a bill.</Text>
            </Card>
          ) : (
            expenses.map((exp) => (
              <Card key={exp._id} style={styles.expCard} variant="flat">
                <View style={styles.expRow}>
                  <View style={styles.expIcon}>
                    <Ionicons name="cart-outline" size={20} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.expTitle}>{exp.title}</Text>
                    <Text style={styles.expSubtitle}>
                      Paid by {exp.paidBy?.name || 'Member'} • {new Date(exp.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.expAmount}>₹{exp.amount.toFixed(2)}</Text>
                </View>
              </Card>
            ))
          )}

          {/* Settlements History */}
          {settlements.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Settlement Activity</Text>
              </View>
              {settlements.map((st) => (
                <Card key={st._id} style={styles.settleCard} variant="flat">
                  <Ionicons name="checkmark-done-circle" size={20} color={COLORS.success} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.settleText}>
                      <Text style={{ fontWeight: '700' }}>{st.payer?.name}</Text> paid{' '}
                      <Text style={{ fontWeight: '700' }}>{st.payee?.name}</Text>
                    </Text>
                    <Text style={styles.settleSub}>{new Date(st.date).toLocaleDateString()}</Text>
                  </View>
                  <Text style={styles.settleAmt}>₹{st.amount.toFixed(2)}</Text>
                </Card>
              ))}
            </>
          )}
        </ScrollView>
      )}

      {/* Modals */}
      <AddGroupExpenseModal
        visible={expenseModalVisible}
        group={group}
        onClose={() => setExpenseModalVisible(false)}
        onCreated={fetchGroupDetails}
      />

      <SettleModal
        visible={settleModalVisible}
        group={group}
        balances={balances}
        currentUserId={user?._id}
        onClose={() => setSettleModalVisible(false)}
        onSettled={fetchGroupDetails}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerCategory: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
  },
  settleBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  settleBtnText: {
    fontSize: SIZES.xs,
    fontWeight: '700',
    color: COLORS.success,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 32,
  },
  bannerCard: {
    padding: 16,
    marginBottom: 20,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  bannerDesc: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addBillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  addBillBtnText: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.white,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  balancesContainer: {
    gap: 8,
    marginBottom: 20,
  },
  balanceCard: {
    padding: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.primary,
  },
  memberName: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  youTag: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    fontWeight: '700',
  },
  memberEmail: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
  },
  balanceAmount: {
    fontSize: SIZES.sm,
    fontWeight: '700',
  },
  balanceStatusText: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  expCard: {
    padding: 12,
    marginBottom: 8,
  },
  expRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expTitle: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  expSubtitle: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  expAmount: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  settleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  settleText: {
    fontSize: SIZES.xs,
    color: COLORS.text,
  },
  settleSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  settleAmt: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.success,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
