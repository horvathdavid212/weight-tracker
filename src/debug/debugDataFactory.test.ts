import { afterEach, describe, expect, it, jest } from '@jest/globals';
import {
  buildSampleWeightEntries,
  buildYearOfWeightEntries,
  mergeUniqueWeightEntries,
} from './debugDataFactory';

describe('debugDataFactory', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('builds the fixed sample entries set relative to the provided date', () => {
    const baseDate = new Date(2026, 4, 14, 16, 30, 0);

    const entries = buildSampleWeightEntries(baseDate);

    expect(entries.map((entry) => entry.id)).toEqual([
      'sample-30',
      'sample-25',
      'sample-20',
      'sample-15',
      'sample-10',
      'sample-5',
      'sample-0',
    ]);
    expect(entries.map((entry) => entry.weight)).toEqual([
      75.3,
      74.8,
      74.2,
      74.2,
      74.6,
      72.7,
      72,
    ]);
    expect(new Date(entries[0].date).getHours()).toBe(8);
    expect(new Date(entries[6].date).getDate()).toBe(14);
  });

  it('merges only non-duplicate date and weight combinations', () => {
    const existing = [
      {
        id: 'existing',
        date: new Date(2026, 4, 14, 12, 0, 0).toISOString(),
        weight: 80,
      },
    ];
    const next = [
      {
        id: 'duplicate',
        date: existing[0].date,
        weight: 80,
      },
      {
        id: 'new-weight',
        date: existing[0].date,
        weight: 79.5,
      },
    ];

    const merged = mergeUniqueWeightEntries(existing, next);

    expect(merged).toHaveLength(2);
    expect(merged.map((entry) => entry.id)).toEqual(['existing', 'new-weight']);
  });

  it('builds a year of entries with deterministic values when random is mocked', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    let counter = 0;
    const entries = buildYearOfWeightEntries(() => `generated-${++counter}`, new Date(2026, 4, 14, 12, 0, 0));

    expect(entries).toHaveLength(122);
    expect(entries[0]).toMatchObject({
      id: 'generated-1',
      weight: 85,
    });
    expect(entries[entries.length - 1]).toMatchObject({
      id: 'generated-122',
      weight: 75.1,
    });
    expect(new Date(entries[0].date).getTime()).toBeLessThan(
      new Date(entries[entries.length - 1].date).getTime()
    );
  });
});
