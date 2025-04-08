import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { WeightEntry } from '../types/WeightEntry';
import WeightInput from "../components/WeightInput";
import WeightChart from "../components/WeightChart";
import WeightEntryList from "../components/WeightEntryList";
import EditEntry from "../components/EditEntry";
import { WeightDataService } from '../services/WeightDataService';

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
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadEntries = async () => {
        setIsLoading(true);
        try {
            const data = await WeightDataService.getEntries();
            setEntries(data);
        } catch (error) {
            console.error('Error loading entries:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadEntries();
    }, []);

    const handleNewEntry = (entry: WeightEntry) => {
        // Update UI immediately for better UX
        const updatedEntries = [entry, ...entries];
        setEntries(updatedEntries);
    };

    const handleSelectEntry = (index: number, entry: WeightEntry) => {
        setSelectedEntryIndex(index);
        setEditingEntry(entry);
    };

    const handleUpdateEntry = async (index: number, updatedEntry: WeightEntry) => {
        try {
            const success = await WeightDataService.updateEntry(index, updatedEntry);
            if (success) {
                const updatedEntries = [...entries];
                updatedEntries[index] = updatedEntry;
                setEntries(updatedEntries);
            }
        } catch (error) {
            console.error('Error updating entry:', error);
        } finally {
            setSelectedEntryIndex(null);
            setEditingEntry(null);
        }
    };

    const handleDeleteEntry = async (index: number) => {
        try {
            const success = await WeightDataService.deleteEntry(index);
            if (success) {
                const updatedEntries = entries.filter((_, i) => i !== index);
                setEntries(updatedEntries);
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
        } finally {
            setSelectedEntryIndex(null);
            setEditingEntry(null);
        }
    };

    return (
        <View style={styles.container}>
            <DebugPanel onDataChange={loadEntries} />
            <WeightInput onNewEntry={handleNewEntry} />

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2196F3" />
                </View>
            ) : (
                <>
                    <WeightChart entries={entries} />
                    <WeightEntryList
                        entries={entries}
                        onSelectEntry={handleSelectEntry}
                        onDeleteEntry={handleDeleteEntry}
                    />
                </>
            )}

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

            <View style={styles.settingsButton}>
                <Button
                    title="Go to Settings"
                    onPress={() => navigation.navigate('Settings')}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 40
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    },
    settingsButton: {
        marginTop: 10,
        marginBottom: 20
    }
});

export default HomeScreen;
