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
import { COLORS, SIZES } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const CURRENCIES = ['₹', '$', '€', '£'];

export default function RegisterScreen({ onNavigateLogin }) {
  const { register, isLoading, authError, clearError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('25000');
  const [currency, setCurrency] = useState('₹');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }

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

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (monthlyBudget && isNaN(Number(monthlyBudget))) {
      newErrors.monthlyBudget = 'Budget must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    clearError();
    if (!validate()) return;
    await register({
      name: name.trim(),
      email: email.trim(),
      password,
      monthlyBudget: Number(monthlyBudget) || 20000,
      currency,
    });
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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badgeWrapper}>
              <Badge text="Create Account" variant="info" />
            </View>
            <Text style={styles.title}>Join SplitFlow</Text>
            <Text style={styles.subtitle}>
              Take control of your spending and shared balances
            </Text>
          </View>

          {/* Form Card */}
          <Card style={styles.formCard} variant="elevated">
            {authError && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>❌ {authError}</Text>
              </View>
            )}

            <Input
              label="Full Name"
              placeholder="e.g. Sarthak Khalasi"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              }}
              error={errors.name}
              autoCapitalize="words"
            />

            <Input
              label="Email Address"
              placeholder="e.g. sarthak@splitflow.com"
              value={email}
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
              placeholder="Minimum 6 characters"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              error={errors.password}
              secureTextEntry
            />

            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }}
              error={errors.confirmPassword}
              secureTextEntry
            />

            {/* Currency Selector */}
            <View style={styles.currencySection}>
              <Text style={styles.sectionLabel}>Preferred Currency</Text>
              <View style={styles.currencyRow}>
                {CURRENCIES.map((cur) => (
                  <TouchableOpacity
                    key={cur}
                    onPress={() => setCurrency(cur)}
                    style={[
                      styles.currencyBtn,
                      currency === cur && styles.currencyBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.currencyText,
                        currency === cur && styles.currencyTextActive,
                      ]}
                    >
                      {cur}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Input
              label="Target Monthly Budget"
              placeholder="e.g. 25000"
              value={monthlyBudget}
              onChangeText={(text) => {
                setMonthlyBudget(text);
                if (errors.monthlyBudget) setErrors((prev) => ({ ...prev, monthlyBudget: null }));
              }}
              error={errors.monthlyBudget}
              keyboardType="numeric"
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              style={styles.submitBtn}
            />
          </Card>

          {/* Navigation to Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already registered? </Text>
            <TouchableOpacity onPress={onNavigateLogin}>
              <Text style={styles.loginLink}>Sign In</Text>
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
    marginBottom: 20,
    marginTop: 10,
  },
  badgeWrapper: {
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
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
  errorBanner: {
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
  },
  currencySection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  currencyRow: {
    flexDirection: 'row',
    gap: 10,
  },
  currencyBtn: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
  },
  currencyBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  currencyText: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  currencyTextActive: {
    color: COLORS.primary,
  },
  submitBtn: {
    marginTop: 10,
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
  loginLink: {
    color: COLORS.primary,
    fontSize: SIZES.md,
    fontWeight: '700',
  },
});
