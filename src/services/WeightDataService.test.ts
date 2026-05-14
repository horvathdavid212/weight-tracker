import AsyncStorage from '@react-native-async-storage/async-storage';
import { describe, expect, it } from '@jest/globals';
import { STORAGE_KEYS } from '../storage/storageKeys';
import { WeightEntry } from '../types/WeightEntry';
import { WeightDataService } from './WeightDataService';

function createEntry(
  id: string,
  year: number,
  month: number,
  day: number,
  weight: number
): WeightEntry {
  return {
    id,
    date: new Date(year, month - 1, day, 12, 0, 0).toISOString(),
    weight,
  };
}

describe('WeightDataService', () => {
  it('normalizes legacy entries and rewrites storage in sorted form', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.weightEntries,
      JSON.stringify([
        {
          date: new Date(2026, 4, 10, 12, 0, 0).toISOString(),
          weight: '80.5',
        },
        {
          id: '',
          date: new Date(2026, 4, 12, 12, 0, 0).toISOString(),
          weight: 79.2,
        },
        {
          id: 'invalid',
          date: 'not-a-date',
          weight: 78,
        },
        'invalid-entry',
      ])
    );

    const entries = await WeightDataService.getEntries();

    expect(entries).toHaveLength(2);
    expect(entries[0]).toMatchObject({ weight: 79.2 });
    expect(entries[1]).toMatchObject({ weight: 80.5 });
    expect(entries[0].id).toMatch(/^weight-legacy-/);
    expect(entries[1].id).toMatch(/^weight-legacy-/);

    const stored = JSON.parse(
      (await AsyncStorage.getItem(STORAGE_KEYS.weightEntries)) ?? 'null'
    );
    expect(stored).toEqual(entries);
  });

  it('adds a new entry with a generated id and keeps entries sorted', async () => {
    await WeightDataService.replaceEntries([
      {
        date: new Date(2026, 4, 10, 12, 0, 0).toISOString(),
        weight: 80,
      },
    ]);

    const saved = await WeightDataService.addEntry({
      date: new Date(2026, 4, 11, 12, 0, 0).toISOString(),
      weight: 79.5,
    });
    const entries = await WeightDataService.getEntries();

    expect(saved).toBe(true);
    expect(entries).toHaveLength(2);
    expect(entries[0].weight).toBe(79.5);
    expect(entries[0].id).toMatch(/^weight-/);
  });

  it('updates an existing entry and re-sorts when the date changes', async () => {
    await WeightDataService.replaceEntries([
      createEntry('older', 2026, 5, 10, 80),
      createEntry('newer', 2026, 5, 11, 79),
    ]);

    const updated = await WeightDataService.updateEntry('older', {
      id: 'ignored',
      date: new Date(2026, 4, 12, 12, 0, 0).toISOString(),
      weight: 78.4,
    });
    const entries = await WeightDataService.getEntries();

    expect(updated).toBe(true);
    expect(entries.map((entry) => entry.id)).toEqual(['older', 'newer']);
    expect(entries[0]).toMatchObject({
      id: 'older',
      weight: 78.4,
    });
  });

  it('replaces entries in normalized sorted order', async () => {
    const entries = await WeightDataService.replaceEntries([
      {
        date: new Date(2026, 4, 10, 12, 0, 0).toISOString(),
        weight: '81.2' as unknown as number,
      },
      createEntry('existing', 2026, 5, 12, 78),
    ]);

    expect(entries.map((entry) => entry.id)).toEqual([
      'existing',
      expect.stringMatching(/^weight-legacy-/),
    ]);
    expect(entries.map((entry) => entry.weight)).toEqual([78, 81.2]);
  });

  it('deletes entries and clears the collection', async () => {
    await WeightDataService.replaceEntries([
      createEntry('first', 2026, 5, 10, 80),
      createEntry('second', 2026, 5, 11, 79),
    ]);

    await expect(WeightDataService.deleteEntry('missing')).resolves.toBe(false);
    await expect(WeightDataService.deleteEntry('first')).resolves.toBe(true);
    await expect(WeightDataService.getEntries()).resolves.toHaveLength(1);

    await expect(WeightDataService.clearAllEntries()).resolves.toBe(true);
    await expect(WeightDataService.getEntries()).resolves.toEqual([]);
  });
});
