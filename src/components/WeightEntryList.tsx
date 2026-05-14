import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    View,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { WeightEntry } from '../types/WeightEntry';
import { Card, Text } from './ui';
import { colors, spacing, borderRadius } from '../theme';
import { formatShortDate } from '../utils/dateFormat';
import { formatWeight } from '../utils/weightFormat';

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
    const sortedEntries = [...entries].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
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

    const getWeightTrend = (currentIndex: number): string | null => {
        if (currentIndex >= sortedEntries.length - 1) return null;

        const currentWeight = sortedEntries[currentIndex].weight;
        const previousWeight = sortedEntries[currentIndex + 1].weight;

        if (currentWeight < previousWeight) return 'v';
        if (currentWeight > previousWeight) return '^';
        return '=';
    };

    const renderItem = ({ item, index }: { item: WeightEntry; index: number }) => {
        const trend = getWeightTrend(index);
        const trendColor = trend === 'v' ? colors.status.success : trend === '^' ? colors.status.error : colors.text.secondary;

        return (
            <Card variant="elevated" style={styles.entryCard}>
                <TouchableOpacity
                    onPress={() => onSelectEntry(item)}
                    onLongPress={() => confirmDelete(item.id)}
                    activeOpacity={0.7}
                >
                    <View style={styles.entryContent}>
                        <Text variant="body1" style={styles.entryDate}>
                            {formatShortDate(item.date)}
                        </Text>
                        <View style={styles.weightContainer}>
                            <View style={styles.weightValue}>
                                <Text variant="h3" color={colors.secondary.main} style={styles.entryWeight}>
                                    {formatWeight(item.weight)}
                                </Text>
                                <Text variant="body2" style={styles.unitText}>kg</Text>
                            </View>
                            {trend && (
                                <View style={[styles.trendBadge, { backgroundColor: trendColor }]}>
                                    <Text variant="body2" color={colors.common.white} style={styles.trendText}>
                                        {trend}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            </Card>
        );
    };

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
            data={isLoading ? [] : sortedEntries}
            keyExtractor={(item) => item.id}
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
    entryCard: {
        marginBottom: spacing.sm,
        padding: 0,
        overflow: 'hidden',
        backgroundColor: colors.background.paper,
        borderLeftWidth: 4,
        borderLeftColor: colors.secondary.main,
    },
    entryContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
    },
    entryDate: {
        color: colors.text.secondary,
    },
    weightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    weightValue: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    entryWeight: {
        marginRight: spacing.xs,
        marginBottom: 0,
        lineHeight: 24,
    },
    unitText: {
        color: colors.text.secondary,
        marginRight: spacing.sm,
        marginBottom: 0,
    },
    trendBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
        marginLeft: spacing.xs,
    },
    trendText: {
        fontWeight: 'bold',
    },
    emptyCard: {
        padding: spacing.lg,
        backgroundColor: colors.background.main,
        borderStyle: 'dashed',
    }
});

export default WeightEntryList;
