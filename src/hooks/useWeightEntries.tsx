import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { StoredWeightEntry, WeightEntry } from '../types/WeightEntry';
import { WeightDataService } from '../services/WeightDataService';

interface WeightEntriesContextValue {
  entries: WeightEntry[];
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
  addEntry: (entry: StoredWeightEntry) => Promise<boolean>;
  updateEntry: (id: string, entry: WeightEntry) => Promise<boolean>;
  deleteEntry: (id: string) => Promise<boolean>;
  replaceEntries: (entries: StoredWeightEntry[]) => Promise<WeightEntry[]>;
  clearEntries: () => Promise<boolean>;
}

const WeightEntriesContext = createContext<WeightEntriesContextValue | undefined>(
  undefined
);

function createOperationError(message: string): Error {
  return new Error(message);
}

export const WeightEntriesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextEntries = await WeightDataService.getEntries();
      setEntries(nextEntries);
    } catch (caughtError) {
      const nextError =
        caughtError instanceof Error
          ? caughtError
          : createOperationError('Failed to load weight entries.');
      setError(nextError);
      console.error('Error loading weight entries:', caughtError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const addEntry = useCallback(
    async (entry: StoredWeightEntry) => {
      const success = await WeightDataService.addEntry(entry);
      if (!success) {
        setError(createOperationError('Failed to add weight entry.'));
        return false;
      }

      await reload();
      return true;
    },
    [reload]
  );

  const updateEntry = useCallback(
    async (id: string, entry: WeightEntry) => {
      const success = await WeightDataService.updateEntry(id, entry);
      if (!success) {
        setError(createOperationError('Failed to update weight entry.'));
        return false;
      }

      await reload();
      return true;
    },
    [reload]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      const success = await WeightDataService.deleteEntry(id);
      if (!success) {
        setError(createOperationError('Failed to delete weight entry.'));
        return false;
      }

      await reload();
      return true;
    },
    [reload]
  );

  const replaceEntries = useCallback(async (nextEntries: StoredWeightEntry[]) => {
    setError(null);
    const normalizedEntries = await WeightDataService.replaceEntries(nextEntries);
    setEntries(normalizedEntries);
    return normalizedEntries;
  }, []);

  const clearEntries = useCallback(async () => {
    const success = await WeightDataService.clearAllEntries();
    if (!success) {
      setError(createOperationError('Failed to clear weight entries.'));
      return false;
    }

    setEntries([]);
    setError(null);
    return true;
  }, []);

  return (
    <WeightEntriesContext.Provider
      value={{
        entries,
        isLoading,
        error,
        reload,
        addEntry,
        updateEntry,
        deleteEntry,
        replaceEntries,
        clearEntries,
      }}
    >
      {children}
    </WeightEntriesContext.Provider>
  );
};

export function useWeightEntries(): WeightEntriesContextValue {
  const context = useContext(WeightEntriesContext);
  if (!context) {
    throw new Error('useWeightEntries must be used within a WeightEntriesProvider');
  }

  return context;
}
