import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  Text as RNText,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeightEntry } from '../types/WeightEntry';
import { useDebug } from '../context/DebugContext';
import { Card, Text, Button } from './ui';
import { colors, spacing, borderRadius } from '../theme';
import { WeightDataService } from '../services/WeightDataService';

interface GlobalDebugPanelProps {
  onDataChange?: () => void;
}

const GlobalDebugPanel: React.FC<GlobalDebugPanelProps> = ({ onDataChange }) => {
  const { isDebugPanelVisible, hideDebugPanel, toggleDebugPanel } = useDebug();
  const [storageData, setStorageData] = useState<Array<readonly [string, string | null]>>([]);
  const [showStorageData, setShowStorageData] = useState(false);

  // Dummy data for testing
  const dummyData: WeightEntry[] = [
    { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), weight: 75.3 },
    { date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), weight: 74.8 },
    { date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), weight: 74.2 },
    { date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), weight: 73.5 },
    { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), weight: 73.1 },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), weight: 72.7 },
    { date: new Date().toISOString(), weight: 72.0 },
  ];

  // Add more dummy data with a trend
  const addDummyData = async () => {
    try {
      const existingData = await AsyncStorage.getItem('weightEntries');
      const currentEntries: WeightEntry[] = existingData ? JSON.parse(existingData) : [];

      // Add dummy data only if it doesn't exist
      const updatedEntries = [...currentEntries];
      for (const dummyEntry of dummyData) {
        if (!currentEntries.some(entry =>
          entry.date === dummyEntry.date &&
          entry.weight === dummyEntry.weight
        )) {
          updatedEntries.push(dummyEntry);
        }
      }

      await AsyncStorage.setItem('weightEntries', JSON.stringify(updatedEntries));
      if (onDataChange) onDataChange();
      Alert.alert('Success', 'Dummy data added successfully');
    } catch (error) {
      console.error('Error adding dummy data:', error);
      Alert.alert('Error', 'Failed to add dummy data');
    }
  };

  // Clear all weight entries
  const clearAllData = async () => {
    try {
      await WeightDataService.clearAllEntries();
      if (onDataChange) onDataChange();
      Alert.alert('Success', 'All data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
      Alert.alert('Error', 'Failed to clear data');
    }
  };

  // Clear all AsyncStorage
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
              await AsyncStorage.clear();
              if (onDataChange) onDataChange();
              Alert.alert('Success', 'All storage cleared successfully');
            } catch (error) {
              console.error('Error clearing storage:', error);
              Alert.alert('Error', 'Failed to clear storage');
            }
          }
        }
      ]
    );
  };

  // View AsyncStorage contents
  const viewStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);
      setStorageData([...stores]); // Convert readonly array to mutable array with spread operator
      setShowStorageData(true);
    } catch (error) {
      console.error('Error fetching AsyncStorage contents', error);
      Alert.alert('Error', 'Failed to fetch storage data');
    }
  };

  // Generate random weight entries for the past year
  const generateYearOfData = async () => {
    try {
      const yearData: WeightEntry[] = [];
      const today = new Date();
      const startWeight = 80 + Math.random() * 10; // Random starting weight between 80-90kg

      // Generate entries for the past year with a slight downward trend and some fluctuations
      for (let i = 365; i >= 0; i -= 3) { // Every 3 days
        const entryDate = new Date();
        entryDate.setDate(today.getDate() - i);

        // Create a downward trend with some random fluctuations
        const progress = (365 - i) / 365; // 0 to 1 as we progress through the year
        const trendWeight = startWeight - (progress * 10); // Lose 10kg over the year
        const fluctuation = (Math.random() - 0.5) * 1.5; // Random fluctuation of ±0.75kg

        yearData.push({
          date: entryDate.toISOString(),
          weight: parseFloat((trendWeight + fluctuation).toFixed(1))
        });
      }

      await AsyncStorage.setItem('weightEntries', JSON.stringify(yearData));
      if (onDataChange) onDataChange();
      Alert.alert('Success', 'A year of weight data generated successfully');
    } catch (error) {
      console.error('Error generating year data:', error);
      Alert.alert('Error', 'Failed to generate year data');
    }
  };

  // Floating button to toggle debug panel
  const FloatingButton = () => (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={toggleDebugPanel}
      activeOpacity={0.8}
    >
      <RNText style={styles.floatingButtonText}>D</RNText>
    </TouchableOpacity>
  );

  return (
    <>
      <FloatingButton />

      <Modal
        visible={isDebugPanelVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={hideDebugPanel}
      >
        <View style={styles.modalOverlay}>
          <Card variant="elevated" style={styles.debugPanel}>
            <View style={styles.header}>
              <Text variant="h3" color={colors.secondary.main}>Debug Panel</Text>
              <TouchableOpacity onPress={hideDebugPanel} style={styles.closeButton}>
                <RNText style={styles.closeButtonText}>×</RNText>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
              <Card variant="outlined" style={styles.section}>
                <Text variant="h4" color={colors.secondary.main} style={styles.sectionTitle}>
                  Data Management
                </Text>
                <View style={styles.buttonGroup}>
                  <Button
                    title="Add Sample Data"
                    onPress={addDummyData}
                    variant="secondary"
                    size="small"
                    style={styles.button}
                  />
                  <Button
                    title="Generate Year Data"
                    onPress={generateYearOfData}
                    variant="secondary"
                    size="small"
                    style={styles.button}
                  />
                  <Button
                    title="Clear Weight Data"
                    onPress={clearAllData}
                    variant="tertiary"
                    size="small"
                    style={styles.button}
                  />
                </View>
              </Card>

              <Card variant="outlined" style={styles.section}>
                <Text variant="h4" color={colors.secondary.main} style={styles.sectionTitle}>
                  Storage Management
                </Text>
                <View style={styles.buttonGroup}>
                  <Button
                    title="View Storage"
                    onPress={viewStorage}
                    variant="secondary"
                    size="small"
                    style={styles.button}
                  />
                  <Button
                    title="Clear All Storage"
                    onPress={clearAllStorage}
                    variant="tertiary"
                    size="small"
                    style={styles.button}
                  />
                </View>
              </Card>

              <Card variant="outlined" style={styles.section}>
                <Text variant="h4" color={colors.secondary.main} style={styles.sectionTitle}>
                  App Information
                </Text>
                <View style={styles.infoRow}>
                  <Text variant="body2" color={colors.text.secondary}>Version:</Text>
                  <Text variant="body2">1.0.0</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text variant="body2" color={colors.text.secondary}>Environment:</Text>
                  <Text variant="body2">Development</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text variant="body2" color={colors.text.secondary}>Build:</Text>
                  <Text variant="body2">{new Date().toLocaleDateString()}</Text>
                </View>
              </Card>
            </ScrollView>
          </Card>
        </View>
      </Modal>

      {/* Modal to display AsyncStorage data */}
      <Modal
        visible={showStorageData}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStorageData(false)}
      >
        <View style={styles.modalOverlay}>
          <Card variant="elevated" style={styles.storagePanel}>
            <View style={styles.header}>
              <Text variant="h3" color={colors.secondary.main}>Storage Contents</Text>
              <TouchableOpacity
                onPress={() => setShowStorageData(false)}
                style={styles.closeButton}
              >
                <RNText style={styles.closeButtonText}>×</RNText>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.storageContent}>
              {storageData.map(([key, value], index) => (
                <View key={index} style={styles.storageItem}>
                  <Text variant="body2" color={colors.secondary.main} style={styles.storageKey}>
                    {key}
                  </Text>
                  <Text variant="caption" style={styles.storageValue}>
                    {value ? (value.length > 100 ? value.substring(0, 100) + '...' : value) : 'null'}
                  </Text>
                </View>
              ))}

              {storageData.length === 0 && (
                <Text variant="body1" style={styles.emptyText}>
                  No data in storage
                </Text>
              )}
            </ScrollView>
          </Card>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: colors.tertiary.main,
  },
  floatingButtonText: {
    color: colors.secondary.main,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  debugPanel: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.tertiary.main,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.tertiary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    marginBottom: spacing.sm,
    width: '48%',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  storagePanel: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    padding: 0,
    overflow: 'hidden',
  },
  storageContent: {
    padding: spacing.md,
  },
  storageItem: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background.main,
    borderRadius: borderRadius.sm,
  },
  storageKey: {
    marginBottom: spacing.xs,
  },
  storageValue: {
    fontFamily: 'monospace',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: spacing.lg,
    color: colors.text.secondary,
  },
});

export default GlobalDebugPanel;
