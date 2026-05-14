export const STORAGE_KEYS = {
  weightEntries: 'weightEntries',
  goalData: 'goalData',
  reminderFrequency: 'reminderFrequency',
  nextReminder: 'nextReminder',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
