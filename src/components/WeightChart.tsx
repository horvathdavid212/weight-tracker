import React, { useMemo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { WeightEntry } from '../types/WeightEntry';
import { Card, Text } from './ui';
import { colors, spacing } from '../theme';
import { buildGoalLine } from '../features/goals/goalService';
import { useGoal } from '../features/goals/useGoal';

type WeightChartProps = {
    entries: WeightEntry[];
};

export default function WeightChart({ entries }: WeightChartProps) {
    const { goalData } = useGoal();

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

    const goalLine = useMemo(
        () => (goalData ? buildGoalLine(chartEntries, goalData) : []),
        [chartEntries, goalData]
    );

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
