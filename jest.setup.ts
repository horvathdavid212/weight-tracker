import { beforeEach, jest } from '@jest/globals';

type NotificationMockModule = {
  __resetMocks: () => void;
  cancelAllScheduledNotificationsAsync: {
    mockResolvedValue: (value: undefined) => void;
  };
  requestPermissionsAsync: {
    mockResolvedValue: (value: { status: string }) => void;
  };
  scheduleNotificationAsync: {
    mockResolvedValue: (value: string) => void;
  };
};

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-notifications', () => {
  let listeners: Array<() => void> = [];
  let notificationHandler: unknown = null;

  return {
    SchedulableTriggerInputTypes: {
      DAILY: 'daily',
      WEEKLY: 'weekly',
      MONTHLY: 'monthly',
    },
    setNotificationHandler: jest.fn((handler: unknown) => {
      notificationHandler = handler;
    }),
    requestPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
    cancelAllScheduledNotificationsAsync: jest.fn(async () => undefined),
    scheduleNotificationAsync: jest.fn(async () => 'scheduled-id'),
    addNotificationReceivedListener: jest.fn((listener: () => void) => {
      listeners.push(listener);

      return {
        remove: jest.fn(() => {
          listeners = listeners.filter((entry) => entry !== listener);
        }),
      };
    }),
    __emitNotificationReceived: () => {
      listeners.forEach((listener) => listener());
    },
    __getNotificationHandler: () => notificationHandler,
    __resetMocks: () => {
      listeners = [];
      notificationHandler = null;
    },
  };
});

beforeEach(async () => {
  const asyncStorageMock = jest.requireMock(
    '@react-native-async-storage/async-storage'
  ) as {
    clear: () => Promise<void>;
  };

  await asyncStorageMock.clear();

  const notifications = jest.requireMock(
    'expo-notifications'
  ) as NotificationMockModule;

  notifications.__resetMocks();
  jest.clearAllMocks();

  notifications.requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
  notifications.cancelAllScheduledNotificationsAsync.mockResolvedValue(undefined);
  notifications.scheduleNotificationAsync.mockResolvedValue('scheduled-id');
});
