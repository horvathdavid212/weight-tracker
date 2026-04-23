import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { WeightEntry } from '../types/WeightEntry';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Text } from './ui';
import { colors, spacing } from '../theme';

interface GoalData {
    currentWeight: number;
    goalWeight: number;
    weightLossRate: number;
    goalDate: string;
}

type WeightChartProps = {
    entries: WeightEntry[];
};

export default function WeightChart({ entries }: WeightChartProps) {
    const [goalLine, setGoalLine] = useState<number[]>([]);

    const chartEntries = useMemo(
        () =>
            [...entries]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 7)
                .reverse(),
        [entries]
    );

    const chartLabels = useMemo(
        () =>
            chartEntries.map((entry, index) => {
                const date = new Date(entry.date);
                const shortLabel = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(
                    date.getDate()
                ).padStart(2, '0')}`;

                if (chartEntries.length > 5 && index % 2 === 1 && index !== chartEntries.length - 1) {
                    return '';
                }

                return shortLabel;
            }),
        [chartEntries]
    );

    const loadGoalData = useCallback(async () => {
        if (chartEntries.length < 2) {
            setGoalLine([]);
            return;
        }

        try {
            const goalDataStr = await AsyncStorage.getItem('goalData');
            if (!goalDataStr) {
                setGoalLine([]);
                return;
            }

            const goalData: GoalData = JSON.parse(goalDataStr);
            const startDate = new Date(chartEntries[0].date);
            const endDate = new Date(goalData.goalDate);
            const totalDuration = endDate.getTime() - startDate.getTime();

            if (Number.isNaN(totalDuration) || totalDuration <= 0) {
                setGoalLine([]);
                return;
            }

            const points = chartEntries.map((entry) => {
                const pointDate = new Date(entry.date);
                const progress = Math.min(
                    Math.max((pointDate.getTime() - startDate.getTime()) / totalDuration, 0),
                    1
                );

                return (
                    goalData.currentWeight +
                    (goalData.goalWeight - goalData.currentWeight) * progress
                );
            });

            setGoalLine(points);
        } catch (error) {
            console.error('Error loading goal data:', error);
            setGoalLine([]);
        }
    }, [chartEntries]);

    useEffect(() => {
        void loadGoalData();
    }, [loadGoalData]);

    if (entries.length < 2) return null;

    const data = {
        labels: chartLabels,
        datasets: [
            {
                data: chartEntries.map(e => e.weight),
                color: (opacity = 1) => `rgba(57, 255, 20, ${opacity})`,
                strokeWidth: 3
            },
            ...(goalLine.length > 0 ? [{
                data: goalLine,
                color: (opacity = 1) => `rgba(100, 100, 250, ${opacity * 0.7})`,
                strokeWidth: 2,
                strokeDashArray: [5, 5]
            }] : [])
        ]
    };

    return (
        <Card variant="elevated" style={styles.chartCard}>
            <Text variant="h3" color={colors.secondary.main} style={styles.chartTitle}>
                Weight Trend
            </Text>
            <LineChart
                data={data}
                width={Dimensions.get('window').width - 60}
                height={220}
                yAxisSuffix="kg"
                chartConfig={{
                    backgroundGradientFrom: colors.background.paper,
                    backgroundGradientTo: colors.background.paper,
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(170, 170, 170, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    propsForLabels: {
                        fontSize: 10,
                    },
                    propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: colors.secondary.dark,
                    },
                    propsForBackgroundLines: {
                        strokeDasharray: '',
                        stroke: colors.tertiary.main,
                    },
                    useShadowColorFromDataset: true
                }}
                bezier
                style={styles.chart}
            />
        </Card>
    );
}

const styles = StyleSheet.create({
    chartCard: {
        marginBottom: spacing.md,
    },
    chartTitle: {
        marginBottom: spacing.md,
    },
    chart: {
        marginVertical: spacing.sm,
        borderRadius: 8,
    },
});
