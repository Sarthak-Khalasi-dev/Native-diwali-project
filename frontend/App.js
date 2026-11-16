import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import { COLORS } from './src/constants/theme';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.splashContent}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>💸</Text>
          </View>
          <Text style={styles.splashTitle}>SplitFlow</Text>
          <Text style={styles.splashSubtitle}>Smart Expense & Group Bill Splitter</Text>
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 24 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {isAuthenticated ? (
        <DashboardScreen />
      ) : authView === 'login' ? (
        <LoginScreen onNavigateRegister={() => setAuthView('register')} />
      ) : (
        <RegisterScreen onNavigateLogin={() => setAuthView('login')} />
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
    padding: 24,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  logoIcon: {
    fontSize: 40,
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  splashSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
});
