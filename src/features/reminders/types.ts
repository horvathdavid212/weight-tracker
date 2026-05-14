export const REMINDER_FREQUENCIES = [
  'disabled',
  'now',
  'daily',
  'weekly',
  'monthly',
] as const;

export type ReminderFrequency = (typeof REMINDER_FREQUENCIES)[number];

export interface ReminderSettings {
  frequency: ReminderFrequency;
  nextReminder: string | null;
}

export function isReminderFrequency(value: string | null): value is ReminderFrequency {
  return REMINDER_FREQUENCIES.includes(value as ReminderFrequency);
}

export function isRecurringReminderFrequency(
  frequency: ReminderFrequency
): frequency is Exclude<ReminderFrequency, 'disabled' | 'now'> {
  return (
    frequency === 'daily' ||
    frequency === 'weekly' ||
    frequency === 'monthly'
  );
}
