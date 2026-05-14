import React, { useMemo } from 'react';
import {
    ActivityIndicator,
    FlatList,
    View,
    StyleSheet,
    Alert,
} from 'react-native';
import { WeightEntry } from '../types/WeightEntry';
import { Card, Text } from './ui';
import { colors, spacing } from '../theme';
import WeightEntryListItem from './WeightEntryListItem';
import {
    buildWeightEntryListViewModels,
    WeightEntryListItemViewModel,
} from '../utils/weightEntryViewModel';

interface WeightEntryListProps {
    entries: WeightEntry[];
    headerContent?: React.ReactNode;
    isLoading?: boolean;
    onSelectEntry: (entry: WeightEntry) => void;
    onDeleteEntry: (id: string) => void;
}

const WeightEntryList: React.FC<WeightEntryListProps> = ({
    entries,
    headerContent,
    isLoading = false,
    onSelectEntry,
    onDeleteEntry,
}) => {
    const entryItems = useMemo(
        () => buildWeightEntryListViewModels(entries),
        [entries]
    );

    const confirmDelete = (id: string) => {
        Alert.alert(
            'Delete Entry',
            'Are you sure you want to delete this entry?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => onDeleteEntry(id)
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: WeightEntryListItemViewModel }) => (
        <WeightEntryListItem
            item={item}
            onPress={() => onSelectEntry(item.entry)}
            onLongPress={() => confirmDelete(item.entry.id)}
        />
    );

    const renderListHeader = () => (
        <View style={styles.headerContainer}>
            {headerContent}
            <Text variant="h2" color={colors.secondary.main} style={styles.listHeader}>
                Weight History
            </Text>
        </View>
    );

    const renderListEmpty = () => {
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.secondary.main} />
                </View>
            );
        }

        return (
            <Card variant="outlined" style={styles.emptyCard}>
                <Text
                    variant="body1"
                    color={colors.text.secondary}
                    align="center"
                >
                    No weight entries yet. Add your first entry above!
                </Text>
            </Card>
        );
    };

    return (
        <FlatList
            data={isLoading ? [] : entryItems}
            keyExtractor={(item) => item.entry.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderListHeader}
            ListEmptyComponent={renderListEmpty}
            contentContainerStyle={styles.listContent}
            style={styles.list}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    headerContainer: {
        paddingTop: spacing.md,
    },
    listHeader: {
        marginBottom: spacing.md,
        marginTop: spacing.md,
    },
    listContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.xl,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: spacing.lg,
    },
    emptyCard: {
        padding: spacing.lg,
        backgroundColor: colors.background.main,
        borderStyle: 'dashed',
    }
});

export default WeightEntryList;
