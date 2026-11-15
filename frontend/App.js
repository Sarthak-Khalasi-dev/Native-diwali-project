import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1B4B" />
      <View style={styles.content}>
        <Text style={styles.badge}>Day 1 Milestone</Text>
        <Text style={styles.title}>SplitFlow</Text>
        <Text style={styles.subtitle}>Smart Expense & Group Bill Splitter</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Project Initialized</Text>
          <Text style={styles.cardText}>Frontend: React Native (Expo)</Text>
          <Text style={styles.cardText}>Backend: Node.js + Express + MongoDB</Text>
          <Text style={styles.cardText}>Target Submission: 22nd Nov 2026</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  badge: {
    backgroundColor: '#4338CA',
    color: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 32,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#38BDF8',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#CBD5E1',
    marginVertical: 4,
  },
});
