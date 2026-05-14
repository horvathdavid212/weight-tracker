import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useDebug } from '../context/DebugContext';
import { generateWeightEntryId } from '../services/WeightDataService';
import { asyncStorageClient, AsyncStorageEntry } from '../storage/asyncStorageClient';
import { useWeightEntries } from '../hooks/useWeightEntries';
import {
  buildSampleWeightEntries,
  buildYearOfWeightEntries,
  mergeUniqueWeightEntries,
} from '../debug/debugDataFactory';
import DebugFloatingButton from './debug/DebugFloatingButton';
import DebugPanelModal from './debug/DebugPanelModal';
import DebugStorageViewer from './debug/DebugStorageViewer';

const GlobalDebugPanel: React.FC = () => {
  const { isDebugPanelVisible, hideDebugPanel, toggleDebugPanel } = useDebug();
  const { entries, replaceEntries, clearEntries, reload } = useWeightEntries();
  const [storageData, setStorageData] = useState<AsyncStorageEntry[]>([]);
  const [showStorageData, setShowStorageData] = useState(false);

  const addDummyData = async () => {
    try {
      const updatedEntries = mergeUniqueWeightEntries(
        entries,
        buildSampleWeightEntries()
      );
      await replaceEntries(updatedEntries);
      Alert.alert('Success', 'Dummy data added successfully');
    } catch (error) {
      console.error('Error adding dummy data:', error);
      Alert.alert('Error', 'Failed to add dummy data');
    }
  };

  const clearAllData = async () => {
    try {
      const success = await clearEntries();
      if (!success) {
        Alert.alert('Error', 'Failed to clear data');
        return;
      }

      Alert.alert('Success', 'All data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
      Alert.alert('Error', 'Failed to clear data');
    }
  };

  const clearAllStorage = async () => {
    Alert.alert(
      'Clear All Storage',
      'This will clear ALL app data including settings. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await asyncStorageClient.clear();
              await reload();
              Alert.alert('Success', 'All storage cleared successfully');
            } catch (error) {
              console.error('Error clearing storage:', error);
              Alert.alert('Error', 'Failed to clear storage');
            }
          },
        },
      ]
    );
  };

  const viewStorage = async () => {
    try {
      const stores = await asyncStorageClient.getAllItems();
      setStorageData(stores);
      setShowStorageData(true);
    } catch (error) {
      console.error('Error fetching AsyncStorage contents', error);
      Alert.alert('Error', 'Failed to fetch storage data');
    }
  };

  const generateYearOfData = async () => {
    try {
      const yearData = buildYearOfWeightEntries(generateWeightEntryId);
      await replaceEntries(yearData);
      Alert.alert('Success', 'A year of weight data generated successfully');
    } catch (error) {
      console.error('Error generating year data:', error);
      Alert.alert('Error', 'Failed to generate year data');
    }
  };

  return (
    <>
      <DebugFloatingButton onPress={toggleDebugPanel} />

      <DebugPanelModal
        visible={isDebugPanelVisible}
        onClose={hideDebugPanel}
        onAddSampleData={addDummyData}
        onGenerateYearData={generateYearOfData}
        onClearWeightData={clearAllData}
        onViewStorage={viewStorage}
        onClearAllStorage={clearAllStorage}
      />

      <DebugStorageViewer
        visible={showStorageData}
        storageData={storageData}
        onClose={() => setShowStorageData(false)}
      />
    </>
  );
};

export default GlobalDebugPanel;
