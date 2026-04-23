export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
}

export type StoredWeightEntry = WeightEntry | Omit<WeightEntry, 'id'>;
