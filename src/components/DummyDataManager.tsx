import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { WeightEntry } from '../types/WeightEntry';
import { WeightDataService } from '../services/WeightDataService';

interface DummyDataManagerProps {
    onDataChange: () => void;
}

const DummyDataManager: React.FC<DummyDataManagerProps> = ({ onDataChange }) => {
    const dummyData: WeightEntry[] = [
        { id: 'legacy-sample-1', date: '2024-02-01T10:00:00.000Z', weight: 115.3 },
        { id: 'legacy-sample-2', date: '2024-02-08T10:00:00.000Z', weight: 114.5 },
        { id: 'legacy-sample-3', date: '2024-02-15T10:00:00.000Z', weight: 113.8 },
        { id: 'legacy-sample-4', date: '2024-02-22T10:00:00.000Z', weight: 113.1 },
    ];

    const addDummyData = async () => {
        try {
            const currentEntries = await WeightDataService.getEntries();
            const updatedEntries = [...currentEntries];
            for (const dummyEntry of dummyData) {
                if (!currentEntries.some(entry =>
                    entry.date === dummyEntry.date &&
                    entry.weight === dummyEntry.weight
                )) {
                    updatedEntries.push(dummyEntry);
                }
            }

            await WeightDataService.replaceEntries(updatedEntries);
            onDataChange();
        } catch (error) {
            console.error('Error adding dummy data:', error);
        }
    };

    const clearDummyData = async () => {
        try {
            const currentEntries = await WeightDataService.getEntries();
            const filteredEntries = currentEntries.filter(entry =>
                !dummyData.some(dummy =>
                    dummy.date === entry.date &&
                    dummy.weight === entry.weight
                )
            );

            await WeightDataService.replaceEntries(filteredEntries);
            onDataChange();
        } catch (error) {
            console.error('Error clearing dummy data:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Add Dummy Data" onPress={addDummyData} />
            <View style={styles.spacer} />
            <Button title="Clear Dummy Data" onPress={clearDummyData} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 5,
    },
    spacer: {
        width: 10,
    },
});

export default DummyDataManager;
