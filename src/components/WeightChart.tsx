import React, { useState, useEffect } from 'react';
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
    const [goalDates, setGoalDates] = useState<string[]>([]);

    useEffect(() => {
        loadGoalData();
    }, [entries]);

    const loadGoalData = async () => {
        try {
            const goalDataStr = await AsyncStorage.getItem('goalData');
            if (!goalDataStr) {
                // Clear goal line if no goal data exists
                setGoalLine([]);
                setGoalDates([]);
                return;
            }

            if (goalDataStr && entries.length >= 2) {
                const goalData: GoalData = JSON.parse(goalDataStr);

                // Calculate points for goal line
                const startDate = new Date(entries[entries.length - 1].date);
                const endDate = new Date(goalData.goalDate);
                const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
                const weightDiff = goalData.goalWeight - goalData.currentWeight;
                const dailyLoss = weightDiff / totalDays;

                // Generate 7 points for the goal line
                const points: number[] = [];
                const dates: string[] = [];
                for (let i = 0; i < 7; i++) {
                    const date = new Date(startDate);
                    date.setDate(date.getDate() + (i * totalDays / 6));
                    const weight = goalData.currentWeight + (dailyLoss * (i * totalDays / 6));
                    points.push(weight);
                    dates.push(date.toISOString().split('T')[0]);
                }

                setGoalLine(points);
                setGoalDates(dates);
            }
        } catch (error) {
            console.error('Error loading goal data:', error);
            // Clear goal line on error
            setGoalLine([]);
            setGoalDates([]);
        }
    };

    if (entries.length < 2) return null;

    // Take the last 7 entries but maintain chronological order
    const chartEntries = entries.slice(-7).sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const data = {
        labels: chartEntries.map(e => e.date.split('T')[0]),
        datasets: [
            {
                data: chartEntries.map(e => e.weight),
                color: (opacity = 1) => `rgba(57, 255, 20, ${opacity})`, // Neon green
                strokeWidth: 3
            },
            // Only include goal line dataset if there are goal points
            ...(goalLine.length > 0 ? [{
                data: goalLine,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`, // White with opacity
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