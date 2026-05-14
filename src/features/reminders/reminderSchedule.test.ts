import { describe, expect, it } from '@jest/globals';
import { buildReminderTrigger, computeNextReminderDate } from './reminderSchedule';

function expectLocalDateParts(
  date: Date | null,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
) {
  expect(date).not.toBeNull();
  expect(date?.getFullYear()).toBe(year);
  expect(date?.getMonth()).toBe(month - 1);
  expect(date?.getDate()).toBe(day);
  expect(date?.getHours()).toBe(hour);
  expect(date?.getMinutes()).toBe(minute);
}

describe('reminderSchedule', () => {
  it('computes the next daily reminder at noon', () => {
    expectLocalDateParts(
      computeNextReminderDate('daily', new Date(2026, 4, 14, 9, 30, 0)),
      2026,
      5,
      14,
      12,
      0
    );
    expectLocalDateParts(
      computeNextReminderDate('daily', new Date(2026, 4, 14, 13, 0, 0)),
      2026,
      5,
      15,
      12,
      0
    );
  });

  it('computes weekly and monthly reminder dates', () => {
    expectLocalDateParts(
      computeNextReminderDate('weekly', new Date(2026, 4, 15, 10, 0, 0)),
      2026,
      5,
      17,
      12,
      0
    );
    expectLocalDateParts(
      computeNextReminderDate('monthly', new Date(2026, 4, 1, 13, 0, 0)),
      2026,
      6,
      1,
      12,
      0
    );
  });

  it('handles immediate and disabled reminders', () => {
    const now = new Date(2026, 4, 14, 10, 0, 0);

    expect(computeNextReminderDate('now', now)?.getTime()).toBe(
      now.getTime() + 5000
    );
    expect(computeNextReminderDate('disabled', now)).toBeNull();
  });

  it('builds Expo-compatible triggers for recurring reminders', () => {
    expect(buildReminderTrigger('daily')).toEqual({
      type: 'daily',
      hour: 12,
      minute: 0,
    });
    expect(buildReminderTrigger('weekly')).toEqual({
      type: 'weekly',
      weekday: 1,
      hour: 12,
      minute: 0,
    });
    expect(buildReminderTrigger('monthly')).toEqual({
      type: 'monthly',
      day: 1,
      hour: 12,
      minute: 0,
    });
    expect(buildReminderTrigger('now')).toBeNull();
  });
});
