import { StoredWeightEntry, WeightEntry } from '../types/WeightEntry';
import { asyncStorageClient } from '../storage/asyncStorageClient';
import { STORAGE_KEYS } from '../storage/storageKeys';

const STORAGE_KEY = STORAGE_KEYS.weightEntries;
const ENTRY_ID_PREFIX = 'weight';

export function generateWeightEntryId(): string {
  return `${ENTRY_ID_PREFIX}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function sortEntriesByDateDesc(entries: WeightEntry[]): WeightEntry[] {
  return [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function hasEntryShape(
  entry: unknown
): entry is Record<string, unknown> {
  return typeof entry === 'object' && entry !== null;
}

function normalizeEntry(entry: unknown, index: number): WeightEntry | null {
  if (!hasEntryShape(entry)) {
    return null;
  }

  const date = typeof entry.date === 'string' ? entry.date : '';
  const weight =
    typeof entry.weight === 'number' ? entry.weight : Number(entry.weight);
  const id =
    typeof entry.id === 'string' && entry.id.trim().length > 0
      ? entry.id
      : `${ENTRY_ID_PREFIX}-legacy-${index}-${new Date(
          date || Date.now()
        ).getTime().toString(36)}`;

  if (!date || Number.isNaN(new Date(date).getTime()) || Number.isNaN(weight)) {
    return null;
  }

  return {
    id,
    date,
    weight,
  };
}

function normalizeEntries(entries: unknown[]): WeightEntry[] {
  return sortEntriesByDateDesc(
    entries
      .map((entry, index) => normalizeEntry(entry, index))
      .filter((entry): entry is WeightEntry => entry !== null)
  );
}

export class WeightDataService {
  /**
   * Get all weight entries
   */
  static async getEntries(): Promise<WeightEntry[]> {
    try {
      const parsed = await asyncStorageClient.getJson<unknown>(STORAGE_KEY);
      if (parsed === null) {
        return [];
      }

      if (!Array.isArray(parsed)) {
        return [];
      }

      const normalizedEntries = normalizeEntries(parsed);
      if (JSON.stringify(parsed) !== JSON.stringify(normalizedEntries)) {
        await asyncStorageClient.setJson(STORAGE_KEY, normalizedEntries);
      }

      return normalizedEntries;
    } catch (error) {
      console.error('Error fetching weight entries:', error);
      return [];
    }
  }

  /**
   * Save a new weight entry
   */
  static async addEntry(entry: StoredWeightEntry): Promise<boolean> {
    try {
      const entries = await this.getEntries();
      const normalizedEntry = normalizeEntry(
        {
          ...entry,
          id: 'id' in entry ? entry.id : generateWeightEntryId(),
        },
        entries.length
      );

      if (!normalizedEntry) {
        return false;
      }

      const updatedEntries = sortEntriesByDateDesc([normalizedEntry, ...entries]);
      await asyncStorageClient.setJson(STORAGE_KEY, updatedEntries);
      return true;
    } catch (error) {
      console.error('Error saving weight entry:', error);
      return false;
    }
  }

  /**
   * Update an existing weight entry
   */
  static async updateEntry(id: string, updatedEntry: WeightEntry): Promise<boolean> {
    try {
      const entries = await this.getEntries();
      const entryIndex = entries.findIndex((entry) => entry.id === id);
      if (entryIndex === -1) {
        return false;
      }

      const normalizedEntry = normalizeEntry(
        {
          ...updatedEntry,
          id,
        },
        entryIndex
      );

      if (!normalizedEntry) {
        return false;
      }

      const updatedEntries = [...entries];
      updatedEntries[entryIndex] = normalizedEntry;
      await asyncStorageClient.setJson(
        STORAGE_KEY,
        sortEntriesByDateDesc(updatedEntries)
      );
      return true;
    } catch (error) {
      console.error('Error updating weight entry:', error);
      return false;
    }
  }

  /**
   * Delete a weight entry
   */
  static async deleteEntry(id: string): Promise<boolean> {
    try {
      const entries = await this.getEntries();
      if (!entries.some((entry) => entry.id === id)) {
        return false;
      }

      const updatedEntries = entries.filter((entry) => entry.id !== id);
      await asyncStorageClient.setJson(STORAGE_KEY, updatedEntries);
      return true;
    } catch (error) {
      console.error('Error deleting weight entry:', error);
      return false;
    }
  }

  /**
   * Replace all weight entries, normalizing legacy records as needed.
   */
  static async replaceEntries(entries: StoredWeightEntry[]): Promise<WeightEntry[]> {
    try {
      const normalizedEntries = normalizeEntries(entries);
      await asyncStorageClient.setJson(STORAGE_KEY, normalizedEntries);
      return normalizedEntries;
    } catch (error) {
      console.error('Error replacing weight entries:', error);
      return [];
    }
  }

  /**
   * Clear all weight entries
   */
  static async clearAllEntries(): Promise<boolean> {
    try {
      await asyncStorageClient.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing weight entries:', error);
      return false;
    }
  }
}
