import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WeightEntry } from '../types/WeightEntry';
import WeightInput from "../components/WeightInput";
import WeightChart from "../components/WeightChart";
import WeightEntryList from "../components/WeightEntryList";
import EditEntry from "../components/EditEntry";
import { Container } from '../components/ui';
import { colors } from '../theme';

import { StackScreenProps } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useWeightEntries } from '../hooks/useWeightEntries';

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = () => {
    const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
    const { entries, isLoading, reload, addEntry, updateEntry, deleteEntry } = useWeightEntries();

    useFocusEffect(
        React.useCallback(() => {
            void reload();
        }, [reload])
    );

    const handleSelectEntry = (entry: WeightEntry) => {
        setEditingEntry(entry);
    };

    const handleUpdateEntry = async (updatedEntry: WeightEntry) => {
        try {
            const success = await updateEntry(updatedEntry.id, updatedEntry);
            if (success) {
                setEditingEntry(null);
            }
        } catch (error) {
            console.error('Error updating entry:', error);
        }
    };

    const handleDeleteEntry = async (id: string) => {
        try {
            const success = await deleteEntry(id);
            if (success) {
                setEditingEntry(null);
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
        }
    };

    return (
        <Container style={styles.container} padded={false}>
            <WeightEntryList
                entries={entries}
                isLoading={isLoading}
                headerContent={(
                    <View>
                        <WeightInput onNewEntry={addEntry} />
                        {!isLoading ? <WeightChart entries={entries} /> : null}
                    </View>
                )}
                onSelectEntry={handleSelectEntry}
                onDeleteEntry={handleDeleteEntry}
            />

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
});

export default HomeScreen;
