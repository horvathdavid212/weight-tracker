import { sortEntriesByDateDesc } from '../services/WeightDataService';
import { WeightEntry } from '../types/WeightEntry';
import { formatShortDate } from './dateFormat';
import { formatWeight } from './weightFormat';

export type WeightTrend = 'loss' | 'gain' | 'same' | null;

export interface WeightEntryListItemViewModel {
  entry: WeightEntry;
  displayDate: string;
  displayWeight: string;
  trend: WeightTrend;
}

function getWeightTrend(
  currentEntry: WeightEntry,
  previousEntry?: WeightEntry
): WeightTrend {
  if (!previousEntry) {
    return null;
  }

  if (currentEntry.weight < previousEntry.weight) {
    return 'loss';
  }

  if (currentEntry.weight > previousEntry.weight) {
    return 'gain';
  }

  return 'same';
}

export function buildWeightEntryListViewModels(
  entries: WeightEntry[]
): WeightEntryListItemViewModel[] {
  const sortedEntries = sortEntriesByDateDesc(entries);

  return sortedEntries.map((entry, index) => {
    const trend = getWeightTrend(entry, sortedEntries[index + 1]);

    return {
      entry,
      displayDate: formatShortDate(entry.date),
      displayWeight: formatWeight(entry.weight),
      trend,
    };
  });
}
