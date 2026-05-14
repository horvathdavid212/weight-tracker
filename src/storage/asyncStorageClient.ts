import AsyncStorage from '@react-native-async-storage/async-storage';

export type AsyncStorageEntry = readonly [string, string | null];

export const asyncStorageClient = {
  getString(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  },

  setString(key: string, value: string): Promise<void> {
    return AsyncStorage.setItem(key, value);
  },

  removeItem(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  },

  multiRemove(keys: readonly string[]): Promise<void> {
    return AsyncStorage.multiRemove([...keys]);
  },

  async getJson<T>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);
    if (value === null) {
      return null;
    }

    return JSON.parse(value) as T;
  },

  setJson<T>(key: string, value: T): Promise<void> {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  },

  clear(): Promise<void> {
    return AsyncStorage.clear();
  },

  getAllKeys(): Promise<readonly string[]> {
    return AsyncStorage.getAllKeys();
  },

  async getAllItems(): Promise<AsyncStorageEntry[]> {
    const keys = await AsyncStorage.getAllKeys();
    const stores = await AsyncStorage.multiGet([...keys]);
    return [...stores];
  },
};
