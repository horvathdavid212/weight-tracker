import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { STORAGE_KEYS } from '../../storage/storageKeys';
import {
  clearReminderSettings,
  getReminderSettings,
  refreshReminderStateIfNeeded,
  updateReminderFrequency,
} from './reminderService';

describe('reminderService', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns disabled settings when nothing is stored', async () => {
    await expect(getReminderSettings()).resolves.toEqual({
      frequency: 'disabled',
      nextReminder: null,
    });
  });

  it('schedules a daily reminder and persists the next reminder date', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 4, 14, 10, 0, 0));

    const settings = await updateReminderFrequency('daily');

    expect(settings).toEqual({
      frequency: 'daily',
      nextReminder: new Date(2026, 4, 14, 12, 0, 0).toISOString(),
    });
    expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: 'Weight Reminder',
        body: "Don't forget to log your weight today!",
      },
      trigger: {
        type: 'daily',
        hour: 12,
        minute: 0,
      },
    });
    await expect(AsyncStorage.getItem(STORAGE_KEYS.reminderFrequency)).resolves.toBe(
      'daily'
    );
    await expect(AsyncStorage.getItem(STORAGE_KEYS.nextReminder)).resolves.toBe(
      new Date(2026, 4, 14, 12, 0, 0).toISOString()
    );
  });

  it('fails cleanly when notification permissions are denied', async () => {
    (
      Notifications.requestPermissionsAsync as unknown as {
        mockResolvedValue: (value: { status: string }) => void;
      }
    ).mockResolvedValue({ status: 'denied' });

    await expect(updateReminderFrequency('weekly')).rejects.toThrow(
      'Permission not granted for notifications.'
    );

    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    await expect(AsyncStorage.getItem(STORAGE_KEYS.reminderFrequency)).resolves.toBe(
      null
    );
  });

  it('refreshes an expired recurring reminder to the next schedule', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 4, 14, 10, 0, 0));

    await AsyncStorage.setItem(STORAGE_KEYS.reminderFrequency, 'daily');
    await AsyncStorage.setItem(
      STORAGE_KEYS.nextReminder,
      new Date(2026, 4, 13, 12, 0, 0).toISOString()
    );

    await expect(refreshReminderStateIfNeeded()).resolves.toEqual({
      frequency: 'daily',
      nextReminder: new Date(2026, 4, 14, 12, 0, 0).toISOString(),
    });
  });

  it('clears reminder settings and scheduled notifications', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.reminderFrequency, 'monthly');
    await AsyncStorage.setItem(
      STORAGE_KEYS.nextReminder,
      new Date(2026, 5, 1, 12, 0, 0).toISOString()
    );

    await expect(clearReminderSettings()).resolves.toEqual({
      frequency: 'disabled',
      nextReminder: null,
    });

    expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    await expect(AsyncStorage.getItem(STORAGE_KEYS.reminderFrequency)).resolves.toBe(
      null
    );
    await expect(AsyncStorage.getItem(STORAGE_KEYS.nextReminder)).resolves.toBe(
      null
    );
  });
});
