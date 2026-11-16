/**
 * SplitFlow Storage Utility
 * Provides asynchronous key-value persistence with graceful fallback
 */

let AsyncStorage = null;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  // If AsyncStorage is not yet linked or available, use memory store
  AsyncStorage = null;
}

const memoryStore = new Map();

export const storage = {
  async setItem(key, value) {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    memoryStore.set(key, stringValue);
    if (AsyncStorage) {
      try {
        await AsyncStorage.setItem(key, stringValue);
      } catch (err) {
        console.warn('[Storage] AsyncStorage setItem error:', err);
      }
    }
  },

  async getItem(key) {
    if (AsyncStorage) {
      try {
        const val = await AsyncStorage.getItem(key);
        if (val !== null && val !== undefined) return val;
      } catch (err) {
        console.warn('[Storage] AsyncStorage getItem error:', err);
      }
    }
    return memoryStore.get(key) || null;
  },

  async removeItem(key) {
    memoryStore.delete(key);
    if (AsyncStorage) {
      try {
        await AsyncStorage.removeItem(key);
      } catch (err) {
        console.warn('[Storage] AsyncStorage removeItem error:', err);
      }
    }
  },

  async clear() {
    memoryStore.clear();
    if (AsyncStorage) {
      try {
        await AsyncStorage.clear();
      } catch (err) {
        console.warn('[Storage] AsyncStorage clear error:', err);
      }
    }
  }
};

export default storage;
