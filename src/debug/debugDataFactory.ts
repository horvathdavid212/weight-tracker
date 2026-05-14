import { WeightEntry } from '../types/WeightEntry';

function createRelativeDate(daysAgo: number, baseDate = new Date()): string {
  const date = new Date(baseDate);
  date.setHours(8, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

export function buildSampleWeightEntries(baseDate = new Date()): WeightEntry[] {
  return [
    { id: 'sample-30', date: createRelativeDate(30, baseDate), weight: 75.3 },
    { id: 'sample-25', date: createRelativeDate(25, baseDate), weight: 74.8 },
    { id: 'sample-20', date: createRelativeDate(20, baseDate), weight: 74.2 },
    { id: 'sample-15', date: createRelativeDate(15, baseDate), weight: 74.2 },
    { id: 'sample-10', date: createRelativeDate(10, baseDate), weight: 74.6 },
    { id: 'sample-5', date: createRelativeDate(5, baseDate), weight: 72.7 },
    { id: 'sample-0', date: createRelativeDate(0, baseDate), weight: 72.0 },
  ];
}

export function mergeUniqueWeightEntries(
  existingEntries: WeightEntry[],
  nextEntries: WeightEntry[]
): WeightEntry[] {
  const mergedEntries = [...existingEntries];

  for (const nextEntry of nextEntries) {
    const hasMatch = existingEntries.some(
      (entry) =>
        entry.date === nextEntry.date && entry.weight === nextEntry.weight
    );

    if (!hasMatch) {
      mergedEntries.push(nextEntry);
    }
  }

  return mergedEntries;
}

export function buildYearOfWeightEntries(
  generateId: () => string,
  baseDate = new Date()
): WeightEntry[] {
  const yearData: WeightEntry[] = [];
  const today = new Date(baseDate);
  const startWeight = 80 + Math.random() * 10;

  for (let i = 365; i >= 0; i -= 3) {
    const entryDate = new Date(today);
    entryDate.setDate(today.getDate() - i);

    const progress = (365 - i) / 365;
    const trendWeight = startWeight - progress * 10;
    const fluctuation = (Math.random() - 0.5) * 1.5;

    yearData.push({
      id: generateId(),
      date: entryDate.toISOString(),
      weight: parseFloat((trendWeight + fluctuation).toFixed(1)),
    });
  }

  return yearData;
}
