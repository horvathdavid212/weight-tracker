import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {
  isReminderFrequency,
  NEXT_REMINDER_KEY,
  REMINDER_FREQUENCY_KEY,
} from '../notifications/scheduler';

/**
 * Custom hook to manage and automatically update the next reminder date
 * @returns {string | null} The next reminder date as an ISO string, or null if no reminder is set
 */
export function useNextReminder() {
  const [nextReminder, setNextReminder] = useState<string | null>(null);

  const fetchNextReminder = useCallback(async () => {
    try {
      const storedReminder = await AsyncStorage.getItem(NEXT_REMINDER_KEY);
      setNextReminder(storedReminder ?? null);
    } catch (error) {
      console.error('Error fetching next reminder:', error);
      setNextReminder(null);
    }
  }, []);

  const updateReminderIfNeeded = useCallback(async () => {
    if (!nextReminder) return;

    const reminderDate = new Date(nextReminder);
    if (reminderDate > new Date()) return;

    const frequency = await AsyncStorage.getItem(REMINDER_FREQUENCY_KEY);
    if (isReminderFrequency(frequency) && frequency !== 'disabled' && frequency !== 'now') {
      await fetchNextReminder();
      return;
    }

    setNextReminder(null);
  }, [fetchNextReminder, nextReminder]);

  useEffect(() => {
    void fetchNextReminder();
  }, [fetchNextReminder]);

  useFocusEffect(
    useCallback(() => {
      void fetchNextReminder();
    }, [fetchNextReminder])
  );

  useEffect(() => {
    void updateReminderIfNeeded();

    if (!nextReminder) return;

    const timeUntilNextReminder = new Date(nextReminder).getTime() - Date.now();
    if (timeUntilNextReminder <= 0) return;

    const timerId = setTimeout(() => {
      void updateReminderIfNeeded();
    }, timeUntilNextReminder + 1000);

    return () => clearTimeout(timerId);
  }, [nextReminder, updateReminderIfNeeded]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      void updateReminderIfNeeded();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [updateReminderIfNeeded]);

  return nextReminder;
}
