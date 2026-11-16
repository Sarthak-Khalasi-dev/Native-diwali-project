import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [backendOnline, setBackendOnline] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await api.analytics.getDashboard();
      if (res.success && res.data) {
        setDashboardData(res.data);
        setBackendOnline(true);
      }
    } catch (err) {
      console.warn('[Dashboard] Error fetching analytics:', err.message);
      setBackendOnline(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const currency = user?.currency || '₹';
  const budget = dashboardData?.budget?.monthlyBudget || user?.monthlyBudget || 25000;
  const totalExpense = dashboardData?.summary?.totalExpense || 0;
  const totalIncome = dashboardData?.summary?.totalIncome || 0;
  const netSavings = dashboardData?.summary?.netSavings || totalIncome - totalExpense;
  const budgetUsedPercentage = dashboardData?.budget?.budgetUsedPercentage || Math.min(100, Math.round((totalExpense / budget) * 100));
  const recentTransactions = dashboardData?.recentTransactions || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Top App Bar */}
        <View style={styles.topBar}>
          <View style={styles.userProfileRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View>
              <Text style={styles.welcomeText}>Hello,</Text>
              <Text style={styles.userNameText}>{user?.name || 'Explorer'}</Text>
            </View>
          </View>

          <View style={styles.topRightActions}>
            <TouchableOpacity onPress={logout} style={styles.logoutBtn} activeOpacity={0.8}>
              <Ionicons name="log-out-outline" size={16} color={COLORS.danger} style={{ marginRight: 4 }} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Milestone Status Card */}
        <Card style={styles.milestoneCard} variant="flat">
          <View style={styles.milestoneHeader}>
            <Badge text="Day 2 • React Native" variant="success" />
            <View style={styles.statusDotRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: backendOnline ? COLORS.success : COLORS.warning },
                ]}
              />
              <Text style={styles.statusDotText}>
                {backendOnline ? 'Backend Connected' : 'Offline Mode'}
              </Text>
            </View>
          </View>
          <Text style={styles.milestoneTitle}>Expo Managed App Architecture</Text>
          <Text style={styles.milestoneDesc}>
            React Navigation 7 Bottom Tabs active. React Native Vector Icons & persistent auth state verified.
          </Text>
        </Card>

        {/* Monthly Budget Card */}
        <Card style={styles.budgetCard} variant="elevated">
          <View style={styles.budgetHeader}>
            <View>
              <Text style={styles.cardSectionTitle}>MONTHLY BUDGET LIMIT</Text>
              <Text style={styles.budgetValue}>
                {currency} {budget.toLocaleString('en-IN')}
              </Text>
            </View>
            <Badge
              text={`${budgetUsedPercentage}% Used`}
              variant={
                budgetUsedPercentage >= 100
                  ? 'danger'
                  : budgetUsedPercentage >= 80
                  ? 'warning'
                  : 'success'
              }
            />
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.min(100, budgetUsedPercentage)}%`,
                  backgroundColor:
                    budgetUsedPercentage >= 100
                      ? COLORS.danger
                      : budgetUsedPercentage >= 80
                      ? COLORS.warning
                      : COLORS.primary,
                },
              ]}
            />
          </View>

          <View style={styles.budgetFooter}>
            <Text style={styles.budgetSubtext}>
              Spent: {currency} {totalExpense.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.budgetSubtext}>
              Remaining: {currency} {Math.max(0, budget - totalExpense).toLocaleString('en-IN')}
            </Text>
          </View>
        </Card>

        {/* Financial Stat Cards */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Income"
            amount={totalIncome}
            currency={currency}
            type="income"
            icon={<Ionicons name="trending-up" size={20} color={COLORS.income} />}
          />
          <StatCard
            title="Expenses"
            amount={totalExpense}
            currency={currency}
            type="expense"
            icon={<Ionicons name="trending-down" size={20} color={COLORS.expense} />}
          />
        </View>

        <StatCard
          title="Net Cashflow Balance"
          amount={netSavings}
          currency={currency}
          type={netSavings >= 0 ? 'income' : 'expense'}
          subtitle={netSavings >= 0 ? 'Surplus this month' : 'Deficit this month'}
          icon={<Ionicons name="wallet-outline" size={20} color={COLORS.secondary} />}
        />

        {/* Recent Activity Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
            <Ionicons name="refresh" size={16} color={COLORS.primary} style={{ marginRight: 4 }} />
            <Text style={styles.refreshLink}>Sync</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 20 }} />
        ) : recentTransactions.length > 0 ? (
          recentTransactions.map((tx) => (
            <Card key={tx._id} style={styles.txCard} variant="flat">
              <View style={styles.txRow}>
                <View style={styles.txIconBox}>
                  <Ionicons
                    name={tx.type === 'income' ? 'arrow-down-circle' : 'receipt-outline'}
                    size={20}
                    color={tx.type === 'income' ? COLORS.income : COLORS.textMuted}
                  />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txCategory}>
                    {tx.category} • {new Date(tx.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.txAmount,
                    { color: tx.type === 'income' ? COLORS.income : COLORS.expense },
                  ]}
                >
                  {tx.type === 'income' ? '+' : '-'}
                  {currency} {tx.amount.toLocaleString('en-IN')}
                </Text>
              </View>
            </Card>
          ))
        ) : (
          <Card style={styles.emptyCard} variant="flat">
            <Ionicons name="document-text-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Transactions Recorded Yet</Text>
            <Text style={styles.emptySubtitle}>
              Run the backend seed or tap the sync button to fetch live transactions.
            </Text>
          </Card>
        )}
      </ScrollView>
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
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: '800',
  },
  welcomeText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userNameText: {
    color: COLORS.text,
    fontSize: SIZES.lg,
    fontWeight: '700',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: SIZES.xs,
    fontWeight: '700',
  },
  milestoneCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderColor: 'rgba(99, 102, 241, 0.25)',
    borderWidth: 1,
    marginBottom: 16,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusDotText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
  },
  milestoneTitle: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  milestoneDesc: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  budgetCard: {
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardSectionTitle: {
    fontSize: SIZES.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  budgetSubtext: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshLink: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  txCard: {
    padding: 12,
    marginBottom: 8,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  txCategory: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
  },
  txAmount: {
    fontSize: SIZES.md,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
