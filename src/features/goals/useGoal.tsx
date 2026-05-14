import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  clearGoalData,
  createGoalData,
  getGoalData,
  saveGoalData,
  validateGoalInput,
} from './goalService';
import { GoalData, GoalInput } from './types';

interface GoalContextValue {
  goalData: GoalData | null;
  isLoading: boolean;
  error: Error | null;
  reloadGoal: () => Promise<void>;
  saveGoal: (input: GoalInput) => Promise<GoalData>;
  clearGoal: () => Promise<void>;
}

const GoalContext = createContext<GoalContextValue | undefined>(undefined);

function normalizeGoalError(error: unknown, fallbackMessage: string): Error {
  return error instanceof Error ? error : new Error(fallbackMessage);
}

export const GoalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [goalData, setGoalData] = useState<GoalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reloadGoal = useCallback(async () => {
    setIsLoading(true);

    try {
      const nextGoalData = await getGoalData();
      setGoalData(nextGoalData);
      setError(null);
    } catch (caughtError) {
      const nextError = normalizeGoalError(caughtError, 'Failed to load goal data');
      setError(nextError);
      console.error('Error loading goal data:', caughtError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadGoal();
  }, [reloadGoal]);

  const saveGoal = useCallback(async (input: GoalInput) => {
    const validationMessage = validateGoalInput(input);
    if (validationMessage) {
      const validationError = new Error(validationMessage);
      setError(validationError);
      throw validationError;
    }

    try {
      const nextGoalData = createGoalData(input);
      const savedGoalData = await saveGoalData(nextGoalData);
      setGoalData(savedGoalData);
      setError(null);
      return savedGoalData;
    } catch (caughtError) {
      const nextError = normalizeGoalError(caughtError, 'Failed to save goal data');
      setError(nextError);
      console.error('Error saving goal data:', caughtError);
      throw nextError;
    }
  }, []);

  const clearGoal = useCallback(async () => {
    try {
      await clearGoalData();
      setGoalData(null);
      setError(null);
    } catch (caughtError) {
      const nextError = normalizeGoalError(caughtError, 'Failed to clear goal data');
      setError(nextError);
      console.error('Error clearing goal data:', caughtError);
      throw nextError;
    }
  }, []);

  return (
    <GoalContext.Provider
      value={{
        goalData,
        isLoading,
        error,
        reloadGoal,
        saveGoal,
        clearGoal,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};

export function useGoal(): GoalContextValue {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error('useGoal must be used within a GoalProvider');
  }

  return context;
}
