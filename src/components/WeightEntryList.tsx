import React from 'react';
import { FlatList, Text, View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { WeightEntry } from '../types/WeightEntry';

interface WeightEntryListProps {
    entries: WeightEntry[];
    onSelectEntry: (index: number, entry: WeightEntry) => void;
    onDeleteEntry: (index: number) => void;
}

const WeightEntryList: React.FC<WeightEntryListProps> = ({ entries, onSelectEntry, onDeleteEntry }) => {
    // Sort entries by date in descending order (newest first)
    const sortedEntries = [...entries].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const confirmDelete = (index: number) => {
        Alert.alert(
            'Delete Entry',
            'Are you sure you want to delete this entry?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => onDeleteEntry(index)
                }
            ]
        );
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getWeightTrend = (currentIndex: number): string | null => {
        // If this is the first entry or there's only one entry, there's no trend
        if (currentIndex >= sortedEntries.length - 1) return null;

        const currentWeight = sortedEntries[currentIndex].weight;
        const previousWeight = sortedEntries[currentIndex + 1].weight;

        if (currentWeight < previousWeight) return '↓';
        if (currentWeight > previousWeight) return '↑';
        return '→';
    };

    const renderItem = ({ item, index }: { item: WeightEntry; index: number }) => {
        const trend = getWeightTrend(index);
        const trendColor = trend === '↓' ? '#4CAF50' : trend === '↑' ? '#F44336' : '#9E9E9E';

        return (
            <TouchableOpacity
                style={styles.entryContainer}
                onPress={() => onSelectEntry(index, item)}
                onLongPress={() => confirmDelete(index)}
                activeOpacity={0.7}
            >
                <View style={styles.entryContent}>
                    <Text style={styles.entryDate}>
                        {formatDate(item.date)}
                    </Text>
                    <View style={styles.weightContainer}>
                        <Text style={styles.entryWeight}>
                            {item.weight} kg
                        </Text>
                        {trend && (
                            <Text style={[styles.trendIndicator, { color: trendColor }]}>
                                {trend}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.listHeader}>Weight History</Text>
            {sortedEntries.length === 0 ? (
                <Text style={styles.emptyMessage}>No weight entries yet. Add your first entry above!</Text>
            ) : (
                <FlatList
                    data={sortedEntries}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
    },
    listHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    listContent: {
        paddingBottom: 20,
    },
    entryContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 8,
        padding: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#2196F3',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    entryContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    entryDate: {
        fontSize: 16,
        color: '#555',
    },
    weightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    entryWeight: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    trendIndicator: {
        fontSize: 18,
        marginLeft: 8,
        fontWeight: 'bold',
    },
    emptyMessage: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20,
    }
});

export default WeightEntryList;
