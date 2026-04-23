import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WeightEntry } from '../types/WeightEntry';
import WeightInput from "../components/WeightInput";
import WeightChart from "../components/WeightChart";
import WeightEntryList from "../components/WeightEntryList";
import EditEntry from "../components/EditEntry";
import { WeightDataService } from '../services/WeightDataService';
import { Container } from '../components/ui';
import { colors, spacing } from '../theme';

import { StackScreenProps } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

interface HomeScreenProps extends StackScreenProps<RootStackParamList, 'Home'> {
    dataVersion: number;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ dataVersion }) => {
    const [entries, setEntries] = useState<WeightEntry[]>([]);
    const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadEntries = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await WeightDataService.getEntries();
            setEntries(data);
        } catch (error) {
            console.error('Error loading entries:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadEntries();
    }, [dataVersion, loadEntries]);

    useFocusEffect(
        React.useCallback(() => {
            void loadEntries();
        }, [loadEntries])
    );

    const handleNewEntry = (_entry: WeightEntry) => {
        void loadEntries();
    };

    const handleSelectEntry = (entry: WeightEntry) => {
        setEditingEntry(entry);
    };

    const handleUpdateEntry = async (updatedEntry: WeightEntry) => {
        try {
            const success = await WeightDataService.updateEntry(updatedEntry.id, updatedEntry);
            if (success) {
                await loadEntries();
            }
        } catch (error) {
            console.error('Error updating entry:', error);
        } finally {
            setEditingEntry(null);
        }
    };

    const handleDeleteEntry = async (id: string) => {
        try {
            const success = await WeightDataService.deleteEntry(id);
            if (success) {
                await loadEntries();
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
        } finally {
            setEditingEntry(null);
        }
    };

    return (
        <Container scrollable style={styles.container}>
            {/* Debug panel is now global */}
            <WeightInput onNewEntry={handleNewEntry} />

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.secondary.main} />
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

            {editingEntry && (
                <EditEntry
                    entry={editingEntry}
                    visible={true}
                    onSave={handleUpdateEntry}
                    onDelete={handleDeleteEntry}
                    onCancel={() => {
                        setEditingEntry(null);
                    }}
                />
            )}


        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.main,
    },
    title: {
        marginBottom: spacing.md,
        marginTop: spacing.lg,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: spacing.lg,
    },

});

export default HomeScreen;
