import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Custom hook to manage and automatically update the next reminder date
 * @returns {string | null} The next reminder date as an ISO string, or null if no reminder is set
 */
export function useNextReminder() {
  const [nextReminder, setNextReminder] = useState<string | null>(null);
  
  // Function to fetch the next reminder from AsyncStorage
  const fetchNextReminder = async () => {
    try {
      const storedReminder = await AsyncStorage.getItem('nextReminder');
      if (storedReminder) {
        setNextReminder(storedReminder);
      } else {
        setNextReminder(null);
      }
    } catch (error) {
      console.error('Error fetching next reminder:', error);
      setNextReminder(null);
    }
  };

  // Calculate the time until the next reminder
  const calculateTimeUntilNextReminder = (): number => {
    if (!nextReminder) return -1;
    
    const now = new Date();
    const reminderDate = new Date(nextReminder);
    
    // If the reminder date has passed, we need to update it
    if (reminderDate <= now) {
      return 0;
    }
    
    // Return milliseconds until the next reminder
    return reminderDate.getTime() - now.getTime();
  };

  // Function to update the reminder when the current one passes
  const updateReminderIfNeeded = async () => {
    if (!nextReminder) return;
    
    const now = new Date();
    const reminderDate = new Date(nextReminder);
    
    // If the reminder date has passed, fetch the updated reminder
    if (reminderDate <= now) {
      // Get the reminder frequency to determine how to calculate the next one
      const frequency = await AsyncStorage.getItem('reminderFrequency');
      
      if (frequency) {
        // Re-fetch the next reminder (which should be updated by the scheduler)
        fetchNextReminder();
      }
    }
  };

  // Initial fetch of the next reminder
  useEffect(() => {
    fetchNextReminder();
  }, []);

  // Set up a timer to check and update the reminder
  useEffect(() => {
    // Update immediately if needed
    updateReminderIfNeeded();
    
    // Calculate time until next reminder
    const timeUntilNextReminder = calculateTimeUntilNextReminder();
    
    // If there's no valid next reminder, don't set a timer
    if (timeUntilNextReminder <= 0) return;
    
    // Set a timer to update when the reminder time passes
    const timerId = setTimeout(() => {
      updateReminderIfNeeded();
    }, timeUntilNextReminder + 1000); // Add 1 second buffer
    
    // Clean up the timer
    return () => clearTimeout(timerId);
  }, [nextReminder]);

  // Set up a periodic check (every minute) to handle any edge cases
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateReminderIfNeeded();
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);

  return nextReminder;
}
