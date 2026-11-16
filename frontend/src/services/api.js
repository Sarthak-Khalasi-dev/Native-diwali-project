import storage from '../utils/storage';

// Base API Configuration for SplitFlow
// When testing on a physical mobile device or Android emulator:
// - Android Emulator: 'http://10.0.2.2:5000/api'
// - Physical device (Expo Go): 'http://<YOUR_LOCAL_IP>:5000/api' (e.g. 192.168.1.5)
// - iOS Simulator / Local Web: 'http://localhost:5000/api'
export const BASE_URL = 'http://localhost:5000/api';

/**
 * Universal HTTP request handler with token injection & error normalization
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Attach JWT token if stored
  const token = await storage.getItem('splitflow_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 sec timeout
    config.signal = controller.signal;

    const res = await fetch(url, config);
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage = data.message || `Request failed with status ${res.status}`;
      const error = new Error(errorMessage);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Connection timed out. Please verify your backend server is running.');
    }
    throw error;
  }
}

export const api = {
  // Auth
  auth: {
    register: (userData) => request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    login: (credentials) => request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    getMe: () => request('/auth/me', {
      method: 'GET',
    }),
    updateProfile: (updates) => request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  },

  // Personal Expenses
  expenses: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/expenses${query ? `?${query}` : ''}`, { method: 'GET' });
    },
    create: (expenseData) => request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    }),
    update: (id, updates) => request(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
    delete: (id) => request(`/expenses/${id}`, {
      method: 'DELETE',
    }),
  },

  // Groups & Split
  groups: {
    list: () => request('/groups', { method: 'GET' }),
    create: (groupData) => request('/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    }),
    getDetails: (id) => request(`/groups/${id}`, { method: 'GET' }),
    addExpense: (groupId, expenseData) => request(`/groups/${groupId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(expenseData),
    }),
    settleUp: (groupId, settlementData) => request(`/groups/${groupId}/settle`, {
      method: 'POST',
      body: JSON.stringify(settlementData),
    }),
  },

  // Analytics
  analytics: {
    getDashboard: () => request('/analytics/dashboard', { method: 'GET' }),
  },

  // Health
  checkHealth: () => request('/health', { method: 'GET' }),
};

export default api;
