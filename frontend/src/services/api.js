// Base API Configuration for SplitFlow
// Update BASE_URL with your local IP address (e.g., http://192.168.1.X:5000/api) when testing on physical device

export const BASE_URL = 'http://localhost:5000/api';

export const endpoints = {
  // Auth
  register: `${BASE_URL}/auth/register`,
  login: `${BASE_URL}/auth/login`,
  me: `${BASE_URL}/auth/me`,
  profile: `${BASE_URL}/auth/profile`,

  // Personal Expenses
  expenses: `${BASE_URL}/expenses`,

  // Groups & Split
  groups: `${BASE_URL}/groups`,

  // Analytics
  analytics: `${BASE_URL}/analytics/dashboard`,
};
