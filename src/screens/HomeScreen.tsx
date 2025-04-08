import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeightEntry } from '../types/WeightEntry';
import WeightInput from "../components/WeightInput";
import WeightChart from "../components/WeightChart";
import WeightEntryList from "../components/WeightEntryList";
import EditEntry from "../components/EditEntry";

import { StackNavigationProp } from '@react-navigation/stack';
import DebugPanel from "../components/DebugPanel";

type RootStackParamList = {
    Home: undefined;
    Settings: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
    navigation: HomeScreenNavigationProp;
}


const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const [entries, setEntries] = useState<WeightEntry[]>([]);
    const [selectedEntryIndex, setSelectedEntryIndex] = useState<number | null>(null);
    const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);

    const loadEntries = async () => {
        const data = await AsyncStorage.getItem('weightEntries');
        if (data) {
            setEntries(JSON.parse(data));
        }
    };

    useEffect(() => {
        loadEntries();
    }, []);

    const handleNewEntry = (entry: WeightEntry) => {
        const updatedEntries = [entry, ...entries];
        setEntries(updatedEntries);
    };

    const handleSelectEntry = (index: number, entry: WeightEntry) => {
        setSelectedEntryIndex(index);
        setEditingEntry(entry);
    };

    const handleUpdateEntry = async (index: number, updatedEntry: WeightEntry) => {
        const updatedEntries = [...entries];
        updatedEntries[index] = updatedEntry;
        setEntries(updatedEntries);
        await AsyncStorage.setItem('weightEntries', JSON.stringify(updatedEntries));
        setSelectedEntryIndex(null);
        setEditingEntry(null);
    };

    const handleDeleteEntry = async (index: number) => {
        const updatedEntries = entries.filter((_, i) => i !== index);
        setEntries(updatedEntries);
        await AsyncStorage.setItem('weightEntries', JSON.stringify(updatedEntries));
        setSelectedEntryIndex(null);
        setEditingEntry(null);
    };

    return (
        <View style={styles.container}>
            <DebugPanel onDataChange={loadEntries} />
            <WeightInput onNewEntry={handleNewEntry} />
            <WeightChart entries={entries} />
            <WeightEntryList
                entries={entries}
                onSelectEntry={handleSelectEntry}
                onDeleteEntry={handleDeleteEntry}
            />
            {selectedEntryIndex !== null && editingEntry && (
                <EditEntry
                    entry={editingEntry}
                    index={selectedEntryIndex}
                    visible={true}
                    onSave={handleUpdateEntry}
                    onDelete={handleDeleteEntry}
                    onCancel={() => {
                        setSelectedEntryIndex(null);
                        setEditingEntry(null);
                    }}
                />
            )}
            <Button title="Go to Settings" onPress={() => navigation.navigate('Settings')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
});

export default HomeScreen;
