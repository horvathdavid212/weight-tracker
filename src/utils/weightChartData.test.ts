import { describe, expect, it } from '@jest/globals';
import { GoalData } from '../features/goals/types';
import { WeightEntry } from '../types/WeightEntry';
import { buildWeightChartData } from './weightChartData';

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

describe('buildWeightChartData', () => {
  it('returns null when there are not enough entries to chart', () => {
    expect(
      buildWeightChartData([createEntry('only', 2026, 5, 1, 80)], null)
    ).toBeNull();
  });

  it('builds a seven-point chart from the newest entries', () => {
    const entries = [
      createEntry('d1', 2026, 5, 1, 80),
      createEntry('d2', 2026, 5, 2, 79),
      createEntry('d3', 2026, 5, 3, 78),
      createEntry('d4', 2026, 5, 4, 77),
      createEntry('d5', 2026, 5, 5, 76),
      createEntry('d6', 2026, 5, 6, 75),
      createEntry('d7', 2026, 5, 7, 74),
      createEntry('d8', 2026, 5, 8, 73),
    ];

    const goalData: GoalData = {
      currentWeight: 79,
      goalWeight: 73,
      weightLossRate: 0.5,
      goalDate: createEntry('goal', 2026, 5, 8, 73).date,
    };

    const chartData = buildWeightChartData(entries, goalData);

    expect(chartData).toEqual({
      labels: ['05/02', '', '05/04', '', '05/06', '', '05/08'],
      weights: [79, 78, 77, 76, 75, 74, 73],
      goalLine: [79, 78, 77, 76, 75, 74, 73],
    });
  });

  it('omits the goal line when there is no active goal', () => {
    const entries = [
      createEntry('older', 2026, 5, 1, 80),
      createEntry('newer', 2026, 5, 2, 79),
    ];

    expect(buildWeightChartData(entries, null)).toEqual({
      labels: ['05/01', '05/02'],
      weights: [80, 79],
      goalLine: [],
    });
  });
});
