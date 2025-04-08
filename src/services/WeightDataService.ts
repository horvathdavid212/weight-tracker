import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeightEntry } from '../types/WeightEntry';

const STORAGE_KEY = 'weightEntries';

export class WeightDataService {
  /**
   * Get all weight entries
   */
  static async getEntries(): Promise<WeightEntry[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error fetching weight entries:', error);
      return [];
    }
  }

  /**
   * Save a new weight entry
   */
  static async addEntry(entry: WeightEntry): Promise<boolean> {
    try {
      const entries = await this.getEntries();
      const updatedEntries = [entry, ...entries];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
      return true;
    } catch (error) {
      console.error('Error saving weight entry:', error);
      return false;
    }
  }

  /**
   * Update an existing weight entry
   */
  static async updateEntry(index: number, updatedEntry: WeightEntry): Promise<boolean> {
    try {
      const entries = await this.getEntries();
      if (index < 0 || index >= entries.length) {
        return false;
      }
      
      entries[index] = updatedEntry;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      return true;
    } catch (error) {
      console.error('Error updating weight entry:', error);
      return false;
    }
  }

  /**
   * Delete a weight entry
   */
  static async deleteEntry(index: number): Promise<boolean> {
    try {
      const entries = await this.getEntries();
      if (index < 0 || index >= entries.length) {
        return false;
      }
      
      const updatedEntries = entries.filter((_, i) => i !== index);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
      return true;
    } catch (error) {
      console.error('Error deleting weight entry:', error);
      return false;
    }
  }

  /**
   * Clear all weight entries
   */
  static async clearAllEntries(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing weight entries:', error);
      return false;
    }
  }
}
