import { describe, expect, it } from '@jest/globals';
import { WeightEntry } from '../types/WeightEntry';
import { buildWeightEntryListViewModels } from './weightEntryViewModel';

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

describe('buildWeightEntryListViewModels', () => {
  it('sorts entries by date descending and computes display values', () => {
    const entries = [
      createEntry('third', 2026, 5, 10, 73),
      createEntry('first', 2026, 5, 12, 72),
      createEntry('fourth', 2026, 5, 9, 71),
      createEntry('second', 2026, 5, 11, 73),
    ];

    const result = buildWeightEntryListViewModels(entries);

    expect(result.map((item) => item.entry.id)).toEqual([
      'first',
      'second',
      'third',
      'fourth',
    ]);
    expect(result.map((item) => item.trend)).toEqual([
      'loss',
      'same',
      'gain',
      null,
    ]);
    expect(result[0]).toMatchObject({
      displayDate: 'May 12, 2026',
      displayWeight: '72',
    });
  });
});
