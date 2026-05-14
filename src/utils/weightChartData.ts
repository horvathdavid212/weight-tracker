import { GoalData } from '../features/goals/types';
import { buildGoalLine } from '../features/goals/goalService';
import { sortEntriesByDateDesc } from '../services/WeightDataService';
import { WeightEntry } from '../types/WeightEntry';

const MAX_CHART_POINTS = 7;

export interface WeightChartViewModel {
  labels: string[];
  weights: number[];
  goalLine: number[];
}

function buildChartLabel(entry: WeightEntry, index: number, total: number): string {
  const date = new Date(entry.date);
  const shortLabel = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(
    date.getDate()
  ).padStart(2, '0')}`;

  if (total > 5 && index % 2 === 1 && index !== total - 1) {
    return '';
  }

  return shortLabel;
}

export function buildWeightChartData(
  entries: WeightEntry[],
  goalData: GoalData | null
): WeightChartViewModel | null {
  const chartEntries = sortEntriesByDateDesc(entries)
    .slice(0, MAX_CHART_POINTS)
    .reverse();

  if (chartEntries.length < 2) {
    return null;
  }

  return {
    labels: chartEntries.map((entry, index) =>
      buildChartLabel(entry, index, chartEntries.length)
    ),
    weights: chartEntries.map((entry) => entry.weight),
    goalLine: goalData ? buildGoalLine(chartEntries, goalData) : [],
  };
}
