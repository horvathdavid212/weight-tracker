import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GlobalDebugPanel from '../components/GlobalDebugPanel';
import { DebugProvider } from '../context/DebugContext';
import { GoalProvider } from '../features/goals/useGoal';
import { ReminderSettingsProvider } from '../features/reminders/useReminderSettings';
import { WeightEntriesProvider } from '../hooks/useWeightEntries';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <DebugProvider>
      <WeightEntriesProvider>
        <GoalProvider>
          <ReminderSettingsProvider>
            <SafeAreaProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                {children}
                {__DEV__ ? <GlobalDebugPanel /> : null}
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </ReminderSettingsProvider>
        </GoalProvider>
      </WeightEntriesProvider>
    </DebugProvider>
  );
};

export default AppProviders;
