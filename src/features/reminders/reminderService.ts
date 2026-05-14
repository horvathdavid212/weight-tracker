import * as Notifications from 'expo-notifications';
import { asyncStorageClient } from '../../storage/asyncStorageClient';
import { STORAGE_KEYS } from '../../storage/storageKeys';
import {
  isRecurringReminderFrequency,
  isReminderFrequency,
  ReminderFrequency,
  ReminderSettings,
} from './types';
import {
  buildReminderTrigger,
  computeNextReminderDate,
} from './reminderSchedule';

const REMINDER_NOTIFICATION_CONTENT = {
  title: 'Weight Reminder',
  body: "Don't forget to log your weight today!",
};

let notificationHandlerInitialized = false;

function createReminderSettings(
  frequency: ReminderFrequency,
  nextReminder: string | null
): ReminderSettings {
  return {
    frequency,
    nextReminder,
  };
}

async function persistReminderSettings(
  settings: ReminderSettings
): Promise<ReminderSettings> {
  if (settings.frequency === 'disabled') {
    await asyncStorageClient.multiRemove([
      STORAGE_KEYS.reminderFrequency,
      STORAGE_KEYS.nextReminder,
    ]);

    return settings;
  }

  await asyncStorageClient.setString(
    STORAGE_KEYS.reminderFrequency,
    settings.frequency
  );

  if (settings.nextReminder) {
    await asyncStorageClient.setString(
      STORAGE_KEYS.nextReminder,
      settings.nextReminder
    );
  } else {
    await asyncStorageClient.removeItem(STORAGE_KEYS.nextReminder);
  }

  return settings;
}

function configureNotificationHandler() {
  if (notificationHandlerInitialized) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  notificationHandlerInitialized = true;
}

export async function getReminderSettings(): Promise<ReminderSettings> {
  const [storedFrequency, storedNextReminder] = await Promise.all([
    asyncStorageClient.getString(STORAGE_KEYS.reminderFrequency),
    asyncStorageClient.getString(STORAGE_KEYS.nextReminder),
  ]);

  return createReminderSettings(
    isReminderFrequency(storedFrequency) ? storedFrequency : 'disabled',
    storedNextReminder ?? null
  );
}

export async function clearReminderSettings(): Promise<ReminderSettings> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  return persistReminderSettings(createReminderSettings('disabled', null));
}

export async function updateReminderFrequency(
  frequency: ReminderFrequency
): Promise<ReminderSettings> {
  if (frequency === 'disabled') {
    return clearReminderSettings();
  }

  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== 'granted') {
    throw new Error('Permission not granted for notifications.');
  }

  const nextReminderDate = computeNextReminderDate(frequency);
  const nextReminder = nextReminderDate?.toISOString() ?? null;

  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: REMINDER_NOTIFICATION_CONTENT,
    trigger: buildReminderTrigger(frequency),
  });

  return persistReminderSettings(
    createReminderSettings(frequency, nextReminder)
  );
}

export async function refreshReminderStateIfNeeded(): Promise<ReminderSettings> {
  const settings = await getReminderSettings();

  if (!settings.nextReminder) {
    return settings;
  }

  const reminderDate = new Date(settings.nextReminder);
  if (Number.isNaN(reminderDate.getTime()) || reminderDate > new Date()) {
    return settings;
  }

  if (isRecurringReminderFrequency(settings.frequency)) {
    const nextReminderDate = computeNextReminderDate(settings.frequency);
    return persistReminderSettings(
      createReminderSettings(
        settings.frequency,
        nextReminderDate?.toISOString() ?? null
      )
    );
  }

  return persistReminderSettings(
    createReminderSettings(settings.frequency, null)
  );
}

export function initializeReminderNotifications(
  onSettingsChange: (settings: ReminderSettings) => void
): () => void {
  configureNotificationHandler();

  const subscription = Notifications.addNotificationReceivedListener(() => {
    void refreshReminderStateIfNeeded()
      .then(onSettingsChange)
      .catch((error) => {
        console.error('Error syncing reminder state after notification:', error);
      });
  });

  return () => {
    subscription.remove();
  };
}
