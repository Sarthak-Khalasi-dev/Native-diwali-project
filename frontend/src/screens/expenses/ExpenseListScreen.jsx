import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import ExpenseModal from '../../components/expense/ExpenseModal';

const CATEGORIES = [
  'All',
  'Food & Dining',
  'Groceries',
  'Transportation',
  'Housing & Rent',
  'Bills & Utilities',
  'Entertainment',
  'Shopping',
  'Salary',
  'Other',
];

export default function ExpenseListScreen() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = async () => {
    try {
      const params = {};
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      const res = await api.expenses.list(params);
      if (res.success && res.data) {
        setExpenses(res.data);
      }
    } catch (err) {
      console.warn('[ExpenseList] Error fetching expenses:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchExpenses();
  }, [selectedCategory]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchExpenses();
  };

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (item) => {
    setEditingExpense(item);
    setModalVisible(true);
  };

  const handleDelete = (id, title) => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.expenses.delete(id);
              fetchExpenses();
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to delete transaction');
            }
          },
        },
      ]
    );
  };

  const currency = user?.currency || '₹';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Transactions</Text>
          <Text style={styles.headerSubtitle}>Personal expenses & income history</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          activeOpacity={0.8}
          onPress={handleOpenAdd}
        >
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter Pills */}
      <View style={styles.filterSection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item)}
              style={[
                styles.filterPill,
                selectedCategory === item && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedCategory === item && styles.filterPillTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Expense List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <Card style={styles.emptyCard} variant="flat">
              <Ionicons name="receipt-outline" size={44} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No Expenses Found</Text>
              <Text style={styles.emptySubtitle}>
                {selectedCategory === 'All'
                  ? 'Tap "+ Add" above to record your first expense or income.'
                  : `No entries in "${selectedCategory}".`}
              </Text>
            </Card>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleOpenEdit(item)}
              onLongPress={() => handleDelete(item._id, item.title)}
            >
              <Card style={styles.itemCard} variant="flat">
                <View style={styles.itemRow}>
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor:
                          item.type === 'income'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : 'rgba(244, 63, 94, 0.15)',
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.type === 'income' ? 'arrow-down-circle' : 'arrow-up-circle'}
                      size={22}
                      color={item.type === 'income' ? COLORS.income : COLORS.expense}
                    />
                  </View>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <View style={styles.itemSubRow}>
                      <Badge text={item.category} variant="primary" size="sm" />
                      <Text style={styles.itemDate}>
                        {new Date(item.date).toLocaleDateString()} • {item.paymentMethod}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rightSection}>
                    <Text
                      style={[
                        styles.itemAmount,
                        { color: item.type === 'income' ? COLORS.income : COLORS.expense },
                      ]}
                    >
                      {item.type === 'income' ? '+' : '-'}
                      {currency} {item.amount.toLocaleString('en-IN')}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleDelete(item._id, item.title)}
                      style={styles.deleteIconBtn}
                    >
                      <Ionicons name="trash-outline" size={16} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Add / Edit Expense Modal */}
      <ExpenseModal
        visible={modalVisible}
        initialExpense={editingExpense}
        onClose={() => setModalVisible(false)}
        onSaved={fetchExpenses}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 4,
  },
  addBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: SIZES.sm,
  },
  filterSection: {
    paddingBottom: 12,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterPillText: {
    fontSize: SIZES.xs,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterPillTextActive: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCard: {
    padding: 14,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemDate: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  itemAmount: {
    fontSize: SIZES.base,
    fontWeight: '700',
  },
  deleteIconBtn: {
    padding: 4,
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
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
