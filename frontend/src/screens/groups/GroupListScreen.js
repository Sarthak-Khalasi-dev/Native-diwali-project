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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function GroupListScreen() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGroups = async () => {
    try {
      const res = await api.groups.list();
      if (res.success && res.data) {
        setGroups(res.data);
      }
    } catch (err) {
      console.warn('[GroupList] Error fetching groups:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGroups();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Shared Groups</Text>
          <Text style={styles.headerSubtitle}>Split bills and track who owes what</Text>
        </View>
        <TouchableOpacity style={styles.createBtn} activeOpacity={0.8}>
          <Ionicons name="people" size={18} color={COLORS.white} />
          <Text style={styles.createBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={groups}
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
              <Ionicons name="people-outline" size={44} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No Split Groups Yet</Text>
              <Text style={styles.emptySubtitle}>
                Create a group for flatmates, trips, or dining out to split bills effortlessly.
              </Text>
            </Card>
          }
          renderItem={({ item }) => (
            <Card style={styles.groupCard} variant="elevated">
              <View style={styles.groupHeader}>
                <View style={styles.iconCircle}>
                  <Ionicons name="home-outline" size={22} color={COLORS.secondary} />
                </View>
                <View style={styles.groupInfo}>
                  <Text style={styles.groupName}>{item.name}</Text>
                  <Text style={styles.groupDesc} numberOfLines={1}>
                    {item.description || 'Shared household & outing expenses'}
                  </Text>
                </View>
                <Badge text={item.category || 'General'} variant="info" size="sm" />
              </View>

              <View style={styles.groupFooter}>
                <View style={styles.membersRow}>
                  <Ionicons name="person-circle-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.membersCount}>
                    {item.members?.length || 1} Member{item.members?.length > 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={styles.actionRow}>
                  <Text style={styles.viewText}>View Split Details →</Text>
                </View>
              </View>
            </Card>
          )}
        />
      )}
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
    paddingBottom: 16,
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
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 4,
  },
  createBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: SIZES.sm,
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
  groupCard: {
    padding: 16,
    marginBottom: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  groupDesc: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: 10,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  membersCount: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewText: {
    fontSize: SIZES.xs,
    fontWeight: '700',
    color: COLORS.primary,
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
