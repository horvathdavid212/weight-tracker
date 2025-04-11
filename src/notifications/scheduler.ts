import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

// Configure how notifications are handled.
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

// Helper function to compute the next reminder date based on frequency.
function computeNextReminder(frequency: string): Date | null {
    const now = new Date();
    if (frequency === 'daily') {
        // Schedule for today at 12:00 pm if in the future, otherwise tomorrow at 12:00 pm.
        const next = new Date(now);
        next.setHours(12, 0, 0, 0);
        if (now >= next) {
            next.setDate(next.getDate() + 1);
        }
        return next;
    } else if (frequency === 'weekly') {
        // Schedule for the upcoming Sunday at 12:00 pm.
        const next = new Date(now);
        next.setHours(12, 0, 0, 0);
        const currentDay = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
        let daysUntilSunday = (7 - currentDay) % 7;
        if (daysUntilSunday === 0 && now >= next) {
            daysUntilSunday = 7;
        }
        next.setDate(next.getDate() + daysUntilSunday);
        return next;
    } else if (frequency === 'monthly') {
        // Schedule for the 1st of next month at 12:00 pm.
        const next = new Date(now);
        next.setHours(12, 0, 0, 0);
        if (now.getDate() > 1 || (now.getDate() === 1 && now >= next)) {
            next.setMonth(next.getMonth() + 1);
        }
        next.setDate(1);
        return next;
    } else if (frequency === 'now') {
        // For 'now', schedule an immediate reminder
        return new Date(now.getTime() + 5000); // 5 seconds from now
    }
    // For unknown frequencies, we don't schedule a future reminder.
    return null;
}

// Function to update the next reminder date in AsyncStorage
export async function updateNextReminderDate(frequency: string) {
    const nextReminderDate = computeNextReminder(frequency);
    if (nextReminderDate) {
        await AsyncStorage.setItem('nextReminder', nextReminderDate.toISOString());
        console.log('Next reminder updated to:', nextReminderDate.toLocaleString());
    } else {
        await AsyncStorage.removeItem('nextReminder');
        console.log('Next reminder cleared');
    }
    return nextReminderDate;
}

// Set up a notification listener to update the next reminder date when a notification is received
Notifications.addNotificationReceivedListener(async () => {
    const frequency = await AsyncStorage.getItem('reminderFrequency');
    if (frequency && frequency !== 'disabled' && frequency !== 'now') {
        await updateNextReminderDate(frequency);
    }
});

export async function scheduleReminder(frequency: string | number) {
    // Convert to string if it's a number
    const frequencyStr = typeof frequency === 'number' ? frequency.toString() : frequency;
    const { status } = await Notifications.requestPermissionsAsync();
    console.log('Schedule reminder', frequencyStr);

    if (status !== 'granted') {
        alert('Permission not granted for notifications');
        return;
    }

    // Clear any existing notifications.
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Compute and store the next reminder date.
    await updateNextReminderDate(frequencyStr);

    if (frequencyStr === 'disabled') {
        return; // Do not schedule any notifications.
    }

    let trigger: Notifications.NotificationTriggerInput;

    if (frequencyStr === 'daily') {
        trigger = {
            type: SchedulableTriggerInputTypes.DAILY,
            hour: 12,
            minute: 0,
        };
    } else if (frequencyStr === 'now') {
        // "Now" can be interpreted as an immediate notification.
        trigger = null;
    } else if (frequencyStr === 'weekly') {
        trigger = {
            type: SchedulableTriggerInputTypes.CALENDAR,
            // Note: Expo's notifications may expect Sunday as 1 instead of 0.
            weekday: 1,
            hour: 12,
            minute: 0,
            repeats: true,
        };
    } else if (frequencyStr === 'monthly') {
        trigger = {
            type: SchedulableTriggerInputTypes.CALENDAR,
            day: 1,
            hour: 12,
            minute: 0,
            repeats: true,
        };
    } else {
        console.warn(`Unknown reminder frequency: ${frequencyStr}`);
        return;
    }

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "⏰ Weight Reminder",
            body: "Don't forget to log your weight today!",
        },
        trigger,
    });
}
