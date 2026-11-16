import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function LoginScreen({ navigation, onNavigateRegister }) {
  const { login, isLoading, authError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    clearError();
    if (!validate()) return;
    await login(email.trim(), password);
  };

  const fillDemoAccount = () => {
    setEmail('sarthak@splitflow.com');
    setPassword('password123');
    setErrors({});
    clearError();
  };

  const goToRegister = () => {
    if (navigation?.navigate) {
      navigation.navigate('Register');
    } else if (onNavigateRegister) {
      onNavigateRegister();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Branding */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="wallet-outline" size={34} color={COLORS.primary} />
            </View>
            <View style={styles.badgeWrapper}>
              <Badge text="Day 2 Milestone" variant="primary" />
            </View>
            <Text style={styles.title}>SplitFlow</Text>
            <Text style={styles.subtitle}>
              Track personal finances & split group expenses effortlessly
            </Text>
          </View>

          {/* Login Card */}
          <Card style={styles.formCard} variant="elevated">
            <Text style={styles.formTitle}>Welcome Back</Text>
            <Text style={styles.formSubtitle}>Sign in to access your financial dashboard</Text>

            {authError && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color={COLORS.danger} style={{ marginRight: 6 }} />
                <Text style={styles.errorBannerText}>{authError}</Text>
              </View>
            )}

            <Input
              label="Email Address"
              placeholder="e.g. sarthak@splitflow.com"
              value={email}
              leftIcon={<Ionicons name="mail-outline" size={18} color={COLORS.textMuted} />}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              leftIcon={<Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} />}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              error={errors.password}
              secureTextEntry
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.loginBtn}
              icon={<Ionicons name="log-in-outline" size={20} color={COLORS.white} />}
            />

            {/* Quick Demo Fill Shortcut */}
            <TouchableOpacity
              style={styles.demoFillBtn}
              onPress={fillDemoAccount}
              activeOpacity={0.7}
            >
              <View style={styles.demoRow}>
                <Ionicons name="sparkles" size={16} color={COLORS.secondary} style={{ marginRight: 6 }} />
                <Text style={styles.demoFillText}>Quick Fill Demo Credentials</Text>
              </View>
              <Text style={styles.demoFillSubtext}>(sarthak@splitflow.com / password123)</Text>
            </TouchableOpacity>
          </Card>

          {/* Navigation to Register */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account yet? </Text>
            <TouchableOpacity onPress={goToRegister}>
              <Text style={styles.signUpLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  badgeWrapper: {
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
  },
  formCard: {
    padding: 22,
  },
  formTitle: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginBottom: 18,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
  },
  errorBannerText: {
    color: COLORS.danger,
    fontSize: SIZES.sm,
    fontWeight: '600',
    flex: 1,
  },
  loginBtn: {
    marginTop: 8,
  },
  demoFillBtn: {
    marginTop: 18,
    paddingVertical: 10,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    alignItems: 'center',
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  demoFillText: {
    color: COLORS.secondary,
    fontWeight: '700',
    fontSize: SIZES.sm,
  },
  demoFillSubtext: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
  },
  signUpLink: {
    color: COLORS.primary,
    fontSize: SIZES.md,
    fontWeight: '700',
  },
});
