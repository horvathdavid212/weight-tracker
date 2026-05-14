import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card, Text } from './ui';
import { colors, spacing } from '../theme';
import { WeightChartViewModel } from '../utils/weightChartData';

type WeightChartProps = {
    chartData: WeightChartViewModel;
};

export default function WeightChart({ chartData }: WeightChartProps) {
    const { width: windowWidth } = useWindowDimensions();

    const chartWidth = useMemo(
        () => Math.max(windowWidth - spacing.md * 4, 240),
        [windowWidth]
    );
    const chartStyle = useMemo(
        () => ({
            ...styles.chart,
            width: chartWidth,
        }),
        [chartWidth]
    );

    const data = useMemo(() => ({
        labels: chartData.labels,
        datasets: [
            {
                data: chartData.weights,
                color: (opacity = 1) => `rgba(57, 255, 20, ${opacity})`,
                strokeWidth: 3
            },
            ...(chartData.goalLine.length > 0 ? [{
                data: chartData.goalLine,
                color: (opacity = 1) => `rgba(100, 100, 250, ${opacity * 0.7})`,
                strokeWidth: 2,
                strokeDashArray: [5, 5]
            }] : [])
        ]
    }), [chartData.goalLine, chartData.labels, chartData.weights]);

    return (
        <Card variant="elevated" style={styles.chartCard}>
            <Text variant="h3" color={colors.secondary.main} style={styles.chartTitle}>
                Weight Trend
            </Text>
            <LineChart
                data={data}
                width={chartWidth}
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
                style={chartStyle}
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
