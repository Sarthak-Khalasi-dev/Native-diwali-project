import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';
import storage from '../utils/storage';

export const AuthContext = createContext();

const TOKEN_KEY = 'splitflow_token';
const USER_KEY = 'splitflow_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Restore stored session on startup
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await storage.getItem(TOKEN_KEY);
        const storedUserJson = await storage.getItem(USER_KEY);

        if (storedToken) {
          setToken(storedToken);
          if (storedUserJson) {
            try {
              setUser(JSON.parse(storedUserJson));
            } catch (e) {
              // Ignore JSON parse error
            }
          }

          // Verify token against backend
          try {
            const meRes = await api.auth.getMe();
            const userData = meRes.data || meRes.user;
            if (meRes.success && userData) {
              setUser(userData);
              await storage.setItem(USER_KEY, JSON.stringify(userData));
            }
          } catch (verifyErr) {
            console.log('[Auth] Token validation background check:', verifyErr.message);
            // If explicitly 401 Unauthorized, invalidate session
            if (verifyErr.status === 401) {
              await storage.removeItem(TOKEN_KEY);
              await storage.removeItem(USER_KEY);
              setToken(null);
              setUser(null);
            }
          }
        }
      } catch (err) {
        console.error('[Auth] Failed to restore session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Login handler
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const response = await api.auth.login({ email, password });
      if (response.success && response.token) {
        setToken(response.token);
        setUser(response.user);
        await storage.setItem(TOKEN_KEY, response.token);
        await storage.setItem(USER_KEY, JSON.stringify(response.user));
        return { success: true, user: response.user };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      const message = err.message || 'Unable to sign in. Please check your credentials.';
      setAuthError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register handler
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const response = await api.auth.register(userData);
      if (response.success && response.token) {
        setToken(response.token);
        setUser(response.user);
        await storage.setItem(TOKEN_KEY, response.token);
        await storage.setItem(USER_KEY, JSON.stringify(response.user));
        return { success: true, user: response.user };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      const message = err.message || 'Unable to register. Please try again.';
      setAuthError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await storage.removeItem(TOKEN_KEY);
      await storage.removeItem(USER_KEY);
    } catch (err) {
      console.warn('[Auth] Logout storage cleanup warning:', err);
    } finally {
      setToken(null);
      setUser(null);
      setAuthError(null);
      setIsLoading(false);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (updates) => {
    try {
      const response = await api.auth.updateProfile(updates);
      const updatedUser = response.data || response.user;
      if (response.success && updatedUser) {
        setUser(updatedUser);
        await storage.setItem(USER_KEY, JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: err.message || 'Update failed' };
    }
  }, []);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        authError,
        login,
        register,
        logout,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
