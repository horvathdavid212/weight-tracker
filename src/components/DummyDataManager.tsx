import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeightEntry } from '../types/WeightEntry';

interface DummyDataManagerProps {
    onDataChange: () => void;
}

const DummyDataManager: React.FC<DummyDataManagerProps> = ({ onDataChange }) => {
    const dummyData: WeightEntry[] = [
        { date: '2024-02-01T10:00:00.000Z', weight: 115.3 },
        { date: '2024-02-08T10:00:00.000Z', weight: 114.5 },
        { date: '2024-02-15T10:00:00.000Z', weight: 113.8 },
        { date: '2024-02-22T10:00:00.000Z', weight: 113.1 },
    ];

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
            onDataChange();
        } catch (error) {
            console.error('Error adding dummy data:', error);
        }
    };

    const clearDummyData = async () => {
        try {
            const existingData = await AsyncStorage.getItem('weightEntries');
            if (!existingData) return;

            const currentEntries: WeightEntry[] = JSON.parse(existingData);
            
            // Remove only the dummy data entries
            const filteredEntries = currentEntries.filter(entry => 
                !dummyData.some(dummy => 
                    dummy.date === entry.date && 
                    dummy.weight === entry.weight
                )
            );
            
            await AsyncStorage.setItem('weightEntries', JSON.stringify(filteredEntries));
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