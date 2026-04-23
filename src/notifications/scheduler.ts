import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { Alert } from 'react-native';

export const REMINDER_FREQUENCY_KEY = 'reminderFrequency';
export const NEXT_REMINDER_KEY = 'nextReminder';

export type ReminderFrequency =
    | 'disabled'
    | 'now'
    | 'daily'
    | 'weekly'
    | 'monthly';

export function isReminderFrequency(value: string | null): value is ReminderFrequency {
    return (
        value === 'disabled' ||
        value === 'now' ||
        value === 'daily' ||
        value === 'weekly' ||
        value === 'monthly'
    );
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

function computeNextReminder(frequency: ReminderFrequency): Date | null {
    const now = new Date();

    if (frequency === 'daily') {
        const next = new Date(now);
        next.setHours(12, 0, 0, 0);
        if (now >= next) {
            next.setDate(next.getDate() + 1);
        }
        return next;
    }

    if (frequency === 'weekly') {
        const next = new Date(now);
        next.setHours(12, 0, 0, 0);
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
        next.setHours(12, 0, 0, 0);
        if (now.getDate() > 1 || (now.getDate() === 1 && now >= next)) {
            next.setMonth(next.getMonth() + 1);
        }
        next.setDate(1);
        return next;
    }

    if (frequency === 'now') {
        return new Date(now.getTime() + 5000);
    }

    return null;
}

export async function updateNextReminderDate(frequency: ReminderFrequency) {
    const nextReminderDate = computeNextReminder(frequency);
    if (nextReminderDate) {
        await AsyncStorage.setItem(NEXT_REMINDER_KEY, nextReminderDate.toISOString());
        console.log('Next reminder updated to:', nextReminderDate.toLocaleString());
    } else {
        await AsyncStorage.removeItem(NEXT_REMINDER_KEY);
        console.log('Next reminder cleared');
    }

    return nextReminderDate;
}

export async function clearReminderSchedule() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.multiRemove([REMINDER_FREQUENCY_KEY, NEXT_REMINDER_KEY]);
}

Notifications.addNotificationReceivedListener(async () => {
    const frequency = await AsyncStorage.getItem(REMINDER_FREQUENCY_KEY);
    if (isReminderFrequency(frequency) && frequency !== 'disabled' && frequency !== 'now') {
        await updateNextReminderDate(frequency);
        return;
    }

    if (frequency === 'now') {
        await AsyncStorage.removeItem(NEXT_REMINDER_KEY);
    }
});

export async function scheduleReminder(frequency: ReminderFrequency) {
    if (frequency === 'disabled') {
        await clearReminderSchedule();
        return;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    console.log('Schedule reminder', frequency);

    if (status !== 'granted') {
        await AsyncStorage.removeItem(NEXT_REMINDER_KEY);
        Alert.alert('Permissions Required', 'Permission not granted for notifications.');
        return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();
    await updateNextReminderDate(frequency);

    let trigger: Notifications.NotificationTriggerInput;

    if (frequency === 'daily') {
        trigger = {
            type: SchedulableTriggerInputTypes.DAILY,
            hour: 12,
            minute: 0,
        };
    } else if (frequency === 'now') {
        trigger = null;
    } else if (frequency === 'weekly') {
        trigger = {
            type: SchedulableTriggerInputTypes.CALENDAR,
            weekday: 1,
            hour: 12,
            minute: 0,
            repeats: true,
        };
    } else {
        trigger = {
            type: SchedulableTriggerInputTypes.CALENDAR,
            day: 1,
            hour: 12,
            minute: 0,
            repeats: true,
        };
    }

    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Weight Reminder',
            body: "Don't forget to log your weight today!",
        },
        trigger,
    });
}
