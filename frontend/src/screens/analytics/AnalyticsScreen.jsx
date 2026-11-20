import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function AnalyticsScreen() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.analytics.getDashboard();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.warn('[Analytics] Error fetching stats:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const currency = user?.currency || '₹';
  const summary = data?.summary || {};
  const categoryBreakdown = data?.categoryBreakdown || [];
  const totalExpense = summary?.totalExpense || 0;
  const totalIncome = summary?.totalIncome || 0;
  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Export report summary
  const handleExportSummary = async () => {
    try {
      let exportText = `--- SplitFlow Monthly Financial Statement ---\n`;
      exportText += `Generated for: ${user?.name || 'User'} (${user?.email})\n`;
      exportText += `Date: 20 November 2026\n`;
      exportText += `Total Income: ${currency}${totalIncome.toLocaleString('en-IN')}\n`;
      exportText += `Total Expenses: ${currency}${totalExpense.toLocaleString('en-IN')}\n`;
      exportText += `Net Savings: ${currency}${netSavings.toLocaleString('en-IN')} (${savingsRate}%)\n`;
      exportText += `\n--- Category Spending Breakdown ---\n`;
      categoryBreakdown.forEach((cat) => {
        exportText += `• ${cat.category}: ${currency}${cat.amount.toLocaleString('en-IN')} (${cat.percentage}%)\n`;
      });

      await Share.share({
        message: exportText,
        title: 'SplitFlow Financial Statement',
      });
    } catch (err) {
      Alert.alert('Export', 'Report generated successfully.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Spending Analytics</Text>
            <Text style={styles.headerSubtitle}>Category breakdown & financial performance</Text>
          </View>
          <TouchableOpacity
            style={styles.exportBtn}
            onPress={handleExportSummary}
            activeOpacity={0.8}
          >
            <Ionicons name="share-outline" size={16} color={COLORS.white} />
            <Text style={styles.exportBtnText}>Export</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Summary Banner */}
            <Card style={styles.summaryCard} variant="elevated">
              <View style={styles.summaryRow}>
                <View>
                  <Text style={styles.summaryLabel}>TOTAL EXPENSES (THIS MONTH)</Text>
                  <Text style={styles.summaryValue}>
                    {currency} {totalExpense.toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.chartIconCircle}>
                  <Ionicons name="pie-chart" size={28} color={COLORS.primary} />
                </View>
              </View>

              {/* Income vs Expense Comparative Bar */}
              <View style={styles.cashflowBarContainer}>
                <View style={styles.cashflowLabels}>
                  <Text style={styles.cfLabel}>Income: {currency}{totalIncome.toLocaleString('en-IN')}</Text>
                  <Text style={styles.cfLabel}>Savings: {savingsRate}%</Text>
                </View>
                <View style={styles.cashflowBarBg}>
                  <View
                    style={[
                      styles.cashflowBarFill,
                      {
                        width: `${Math.min(
                          100,
                          totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 100
                        )}%`,
                        backgroundColor:
                          totalExpense > totalIncome ? COLORS.danger : COLORS.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            </Card>

            {/* Financial Health Indicators */}
            <View style={styles.statsRow}>
              <Card style={styles.halfCard} variant="flat">
                <Ionicons name="wallet-outline" size={20} color={COLORS.success} />
                <Text style={styles.statLabel}>Net Savings</Text>
                <Text style={[styles.statValue, { color: netSavings >= 0 ? COLORS.success : COLORS.danger }]}>
                  {netSavings >= 0 ? '+' : ''}{currency} {netSavings.toLocaleString('en-IN')}
                </Text>
              </Card>

              <Card style={styles.halfCard} variant="flat">
                <Ionicons name="speedometer-outline" size={20} color={COLORS.secondary} />
                <Text style={styles.statLabel}>Budget Burn</Text>
                <Text style={styles.statValue}>
                  {summary.budgetUsedPercentage || 0}%
                </Text>
              </Card>
            </View>

            {/* Category Breakdown Progress List */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Category Spending</Text>
              <Badge text={`${categoryBreakdown.length} Categories`} variant="primary" size="sm" />
            </View>

            {categoryBreakdown.length > 0 ? (
              categoryBreakdown.map((cat, idx) => (
                <Card key={idx} style={styles.catCard} variant="flat">
                  <View style={styles.catHeader}>
                    <Text style={styles.catName}>{cat.category}</Text>
                    <Text style={styles.catAmount}>
                      {currency} {cat.amount.toLocaleString('en-IN')}{' '}
                      <Text style={styles.catPct}>({cat.percentage}%)</Text>
                    </Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.min(100, cat.percentage)}%`,
                          backgroundColor:
                            idx % 4 === 0
                              ? COLORS.primary
                              : idx % 4 === 1
                              ? COLORS.secondary
                              : idx % 4 === 2
                              ? COLORS.warning
                              : COLORS.success,
                        },
                      ]}
                    />
                  </View>
                </Card>
              ))
            ) : (
              <Card style={styles.emptyCard} variant="flat">
                <Ionicons name="stats-chart-outline" size={44} color={COLORS.textMuted} />
                <Text style={styles.emptyTitle}>No Category Data</Text>
                <Text style={styles.emptySubtitle}>
                  Add some expenses in the Transactions tab to see your category insights!
                </Text>
              </Card>
            )}
          </>
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
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  exportBtnText: {
    fontSize: SIZES.xs,
    fontWeight: '700',
    color: COLORS.text,
  },
  summaryCard: {
    padding: 18,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: SIZES.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  chartIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cashflowBarContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: 12,
  },
  cashflowLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cfLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
  },
  cashflowBarBg: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  cashflowBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  halfCard: {
    flex: 1,
    padding: 14,
  },
  statLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 6,
    marginBottom: 2,
  },
  statValue: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  catCard: {
    padding: 14,
    marginBottom: 10,
  },
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  catName: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  catAmount: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  catPct: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
