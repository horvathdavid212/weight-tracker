import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { ReminderFrequency } from './types';

const REMINDER_HOUR = 12;
const REMINDER_MINUTE = 0;
const IMMEDIATE_REMINDER_DELAY_MS = 5000;

export function computeNextReminderDate(
  frequency: ReminderFrequency,
  now = new Date()
): Date | null {
  if (frequency === 'daily') {
    const next = new Date(now);
    next.setHours(REMINDER_HOUR, REMINDER_MINUTE, 0, 0);

    if (now >= next) {
      next.setDate(next.getDate() + 1);
    }

    return next;
  }

  if (frequency === 'weekly') {
    const next = new Date(now);
    next.setHours(REMINDER_HOUR, REMINDER_MINUTE, 0, 0);
    const currentDay = now.getDay();
    let daysUntilSunday = (7 - currentDay) % 7;

    if (daysUntilSunday === 0 && now >= next) {
      daysUntilSunday = 7;
    }

    next.setDate(next.getDate() + daysUntilSunday);
    return next;
  }

  if (frequency === 'monthly') {
    const next = new Date(now);
    next.setHours(REMINDER_HOUR, REMINDER_MINUTE, 0, 0);

    if (now.getDate() > 1 || (now.getDate() === 1 && now >= next)) {
      next.setMonth(next.getMonth() + 1);
    }

    next.setDate(1);
    return next;
  }

  if (frequency === 'now') {
    return new Date(now.getTime() + IMMEDIATE_REMINDER_DELAY_MS);
  }

  return null;
}

export function buildReminderTrigger(
  frequency: ReminderFrequency
): Notifications.NotificationTriggerInput {
  if (frequency === 'daily') {
    return {
      type: SchedulableTriggerInputTypes.DAILY,
      hour: REMINDER_HOUR,
      minute: REMINDER_MINUTE,
    };
  }

  if (frequency === 'weekly') {
    return {
      type: SchedulableTriggerInputTypes.WEEKLY,
      weekday: 1,
      hour: REMINDER_HOUR,
      minute: REMINDER_MINUTE,
    };
  }

  if (frequency === 'monthly') {
    return {
      type: SchedulableTriggerInputTypes.MONTHLY,
      day: 1,
      hour: REMINDER_HOUR,
      minute: REMINDER_MINUTE,
    };
  }

  return null;
}
