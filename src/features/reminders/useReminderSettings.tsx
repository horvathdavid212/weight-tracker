import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppState } from 'react-native';
import {
  clearReminderSettings as clearReminderSettingsFromService,
  getReminderSettings,
  initializeReminderNotifications,
  refreshReminderStateIfNeeded,
  updateReminderFrequency as updateReminderFrequencyInService,
} from './reminderService';
import { ReminderFrequency, ReminderSettings } from './types';

interface ReminderSettingsContextValue {
  reminderFrequency: ReminderFrequency;
  nextReminder: string | null;
  isLoading: boolean;
  error: Error | null;
  reloadReminderSettings: () => Promise<void>;
  updateReminderFrequency: (frequency: ReminderFrequency) => Promise<ReminderSettings>;
  clearReminderSettings: () => Promise<ReminderSettings>;
}

const ReminderSettingsContext = createContext<
  ReminderSettingsContextValue | undefined
>(undefined);

function normalizeReminderError(
  error: unknown,
  fallbackMessage: string
): Error {
  return error instanceof Error ? error : new Error(fallbackMessage);
}

export const ReminderSettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [reminderFrequency, setReminderFrequency] =
    useState<ReminderFrequency>('disabled');
  const [nextReminder, setNextReminder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const applyReminderSettings = useCallback((settings: ReminderSettings) => {
    setReminderFrequency(settings.frequency);
    setNextReminder(settings.nextReminder);
  }, []);

  const reloadReminderSettings = useCallback(async () => {
    setIsLoading(true);

    try {
      const settings = await getReminderSettings();
      applyReminderSettings(settings);
      setError(null);
    } catch (caughtError) {
      const nextError = normalizeReminderError(
        caughtError,
        'Failed to load reminder settings'
      );
      setError(nextError);
      console.error('Error loading reminder settings:', caughtError);
    } finally {
      setIsLoading(false);
    }
  }, [applyReminderSettings]);

  const syncReminderState = useCallback(async () => {
    try {
      const settings = await refreshReminderStateIfNeeded();
      applyReminderSettings(settings);
      setError(null);
    } catch (caughtError) {
      const nextError = normalizeReminderError(
        caughtError,
        'Failed to refresh reminder settings'
      );
      setError(nextError);
      console.error('Error refreshing reminder settings:', caughtError);
    }
  }, [applyReminderSettings]);

  useEffect(() => {
    void reloadReminderSettings();
  }, [reloadReminderSettings]);

  useEffect(() => {
    const cleanupNotifications = initializeReminderNotifications((settings) => {
      applyReminderSettings(settings);
      setError(null);
    });

    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void syncReminderState();
      }
    });

    return () => {
      cleanupNotifications();
      appStateSubscription.remove();
    };
  }, [applyReminderSettings, syncReminderState]);

  useEffect(() => {
    if (!nextReminder) {
      return;
    }

    const timeUntilNextReminder = new Date(nextReminder).getTime() - Date.now();
    if (timeUntilNextReminder <= 0) {
      void syncReminderState();
      return;
    }

    const timerId = setTimeout(() => {
      void syncReminderState();
    }, timeUntilNextReminder + 1000);

    return () => clearTimeout(timerId);
  }, [nextReminder, syncReminderState]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      void syncReminderState();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [syncReminderState]);

  const updateReminderFrequency = useCallback(
    async (frequency: ReminderFrequency) => {
      try {
        const settings = await updateReminderFrequencyInService(frequency);
        applyReminderSettings(settings);
        setError(null);
        return settings;
      } catch (caughtError) {
        const nextError = normalizeReminderError(
          caughtError,
          'Failed to update reminder settings'
        );
        setError(nextError);
        console.error('Error updating reminder settings:', caughtError);
        throw nextError;
      }
    },
    [applyReminderSettings]
  );

  const clearReminderSettings = useCallback(async () => {
    try {
      const settings = await clearReminderSettingsFromService();
      applyReminderSettings(settings);
      setError(null);
      return settings;
    } catch (caughtError) {
      const nextError = normalizeReminderError(
        caughtError,
        'Failed to clear reminder settings'
      );
      setError(nextError);
      console.error('Error clearing reminder settings:', caughtError);
      throw nextError;
    }
  }, [applyReminderSettings]);

  const value = useMemo(
    () => ({
      reminderFrequency,
      nextReminder,
      isLoading,
      error,
      reloadReminderSettings,
      updateReminderFrequency,
      clearReminderSettings,
    }),
    [
      clearReminderSettings,
      error,
      isLoading,
      nextReminder,
      reloadReminderSettings,
      reminderFrequency,
      updateReminderFrequency,
    ]
  );

  return (
    <ReminderSettingsContext.Provider value={value}>
      {children}
    </ReminderSettingsContext.Provider>
  );
};

export function useReminderSettings(): ReminderSettingsContextValue {
  const context = useContext(ReminderSettingsContext);
  if (!context) {
    throw new Error(
      'useReminderSettings must be used within a ReminderSettingsProvider'
    );
  }

  return context;
}
