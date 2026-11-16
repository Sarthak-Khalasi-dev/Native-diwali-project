import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
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
  const categoryBreakdown = data?.categoryBreakdown || [];
  const totalExpense = data?.summary?.totalExpense || 0;

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
          <Text style={styles.headerTitle}>Spending Analytics</Text>
          <Text style={styles.headerSubtitle}>Category breakdown & monthly distribution</Text>
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
            </Card>

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
                            idx % 3 === 0
                              ? COLORS.primary
                              : idx % 3 === 1
                              ? COLORS.secondary
                              : COLORS.warning,
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
  summaryCard: {
    padding: 18,
    marginBottom: 20,
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
