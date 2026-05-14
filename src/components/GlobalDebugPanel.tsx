import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
  View,
} from 'react-native';
import { WeightEntry } from '../types/WeightEntry';
import { useDebug } from '../context/DebugContext';
import { AppModal, Button, Card, ModalHeader, Text } from './ui';
import { borderRadius, colors, spacing } from '../theme';
import { generateWeightEntryId } from '../services/WeightDataService';
import { asyncStorageClient, AsyncStorageEntry } from '../storage/asyncStorageClient';
import { useWeightEntries } from '../hooks/useWeightEntries';
import { formatShortDate } from '../utils/dateFormat';

const GlobalDebugPanel: React.FC = () => {
  const { isDebugPanelVisible, hideDebugPanel, toggleDebugPanel } = useDebug();
  const { entries, replaceEntries, clearEntries, reload } = useWeightEntries();
  const [storageData, setStorageData] = useState<AsyncStorageEntry[]>([]);
  const [showStorageData, setShowStorageData] = useState(false);

  const createRelativeDate = (daysAgo: number) => {
    const date = new Date();
    date.setHours(8, 0, 0, 0);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  };

  const dummyData: WeightEntry[] = [
    { id: 'sample-30', date: createRelativeDate(30), weight: 75.3 },
    { id: 'sample-25', date: createRelativeDate(25), weight: 74.8 },
    { id: 'sample-20', date: createRelativeDate(20), weight: 74.2 },
    { id: 'sample-15', date: createRelativeDate(15), weight: 73.5 },
    { id: 'sample-10', date: createRelativeDate(10), weight: 73.1 },
    { id: 'sample-5', date: createRelativeDate(5), weight: 72.7 },
    { id: 'sample-0', date: createRelativeDate(0), weight: 72.0 },
  ];

  const addDummyData = async () => {
    try {
      const updatedEntries = [...entries];
      for (const dummyEntry of dummyData) {
        if (
          !entries.some(
            (entry) =>
              entry.date === dummyEntry.date && entry.weight === dummyEntry.weight
          )
        ) {
          updatedEntries.push(dummyEntry);
        }
      }

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
      const yearData: WeightEntry[] = [];
      const today = new Date();
      const startWeight = 80 + Math.random() * 10;

      for (let i = 365; i >= 0; i -= 3) {
        const entryDate = new Date();
        entryDate.setDate(today.getDate() - i);

        const progress = (365 - i) / 365;
        const trendWeight = startWeight - progress * 10;
        const fluctuation = (Math.random() - 0.5) * 1.5;

        yearData.push({
          id: generateWeightEntryId(),
          date: entryDate.toISOString(),
          weight: parseFloat((trendWeight + fluctuation).toFixed(1)),
        });
      }

      await replaceEntries(yearData);
      Alert.alert('Success', 'A year of weight data generated successfully');
    } catch (error) {
      console.error('Error generating year data:', error);
      Alert.alert('Error', 'Failed to generate year data');
    }
  };

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

      <AppModal
        visible={isDebugPanelVisible}
        animationType="slide"
        onRequestClose={hideDebugPanel}
        dismissOnBackdropPress={false}
        panelStyle={styles.debugPanel}
      >
        <ModalHeader title="Debug Panel" onClose={hideDebugPanel} showDivider />

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
              <Text variant="body2" color={colors.text.secondary}>
                Version:
              </Text>
              <Text variant="body2">1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="body2" color={colors.text.secondary}>
                Environment:
              </Text>
              <Text variant="body2">Development</Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="body2" color={colors.text.secondary}>
                Build:
              </Text>
              <Text variant="body2">{formatShortDate(new Date())}</Text>
            </View>
          </Card>
        </ScrollView>
      </AppModal>

      <AppModal
        visible={showStorageData}
        animationType="slide"
        onRequestClose={() => setShowStorageData(false)}
        dismissOnBackdropPress={false}
        panelStyle={styles.storagePanel}
      >
        <ModalHeader
          title="Storage Contents"
          onClose={() => setShowStorageData(false)}
          showDivider
        />

        <ScrollView style={styles.storageContent}>
          {storageData.map(([key, value], index) => (
            <View key={index} style={styles.storageItem}>
              <Text variant="body2" color={colors.secondary.main} style={styles.storageKey}>
                {key}
              </Text>
              <Text variant="caption" style={styles.storageValue}>
                {value ? (value.length > 100 ? `${value.substring(0, 100)}...` : value) : 'null'}
              </Text>
            </View>
          ))}

          {storageData.length === 0 ? (
            <Text variant="body1" style={styles.emptyText}>
              No data in storage
            </Text>
          ) : null}
        </ScrollView>
      </AppModal>
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
  debugPanel: {
    width: '90%',
    maxWidth: 800,
    maxHeight: '80%',
    backgroundColor: colors.background.paper,
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
    maxWidth: 800,
    maxHeight: '80%',
    backgroundColor: colors.background.paper,
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
