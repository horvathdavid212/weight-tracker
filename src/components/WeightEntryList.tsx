import React from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { WeightEntry } from '../types/WeightEntry';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WeightEntryListProps {
    entries: WeightEntry[];
    onSelectEntry: (index: number, entry: WeightEntry) => void;
    onDeleteEntry: (index: number) => void;
}

const WeightEntryList: React.FC<WeightEntryListProps> = ({ entries, onSelectEntry, onDeleteEntry }) => {
    const deleteEntry = async (index: number) => {
        Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: async () => {
                    const updated = entries.filter((_, i) => i !== index);
                    await AsyncStorage.setItem('weightEntries', JSON.stringify(updated));
                    onDeleteEntry(index);
                }
            }
        ]);
    };

    const renderItem = ({ item, index }: { item: WeightEntry; index: number }) => (
        <TouchableOpacity
            onPress={() => onSelectEntry(index, item)}
            onLongPress={() => deleteEntry(index)}
        >
            <Text style={styles.entry}>
                {item.date.split('T')[0]} - {item.weight} kg
            </Text>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={entries}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
        />
    );
};

const styles = StyleSheet.create({
    entry: { fontSize: 16, paddingVertical: 10 },
});

export default WeightEntryList;
