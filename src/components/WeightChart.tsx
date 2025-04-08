import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { WeightEntry } from '../types/WeightEntry';

type WeightChartProps = {
    entries: WeightEntry[];
};

export default function WeightChart({ entries }: WeightChartProps) {
    if (entries.length < 2) return null;

    // Take the last 7 entries but maintain chronological order (oldest to newest)
    const chartEntries = entries.slice(-7).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const data = {
        labels: chartEntries.map(e => e.date.split('T')[0]),
        datasets: [
            {
                data: chartEntries.map(e => e.weight),
            },
        ],
    };

    return (
        <LineChart
            data={data}
            width={Dimensions.get('window').width - 40}
            height={220}
            yAxisSuffix="kg"
            chartConfig={{
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForDots: {
                    r: '4',
                    strokeWidth: '1',
                    stroke: '#333',
                },
            }}
            bezier
            style={styles.chart}
        />
    );
}

const styles = StyleSheet.create({
    chart: {
        marginVertical: 20,
        borderRadius: 8,
    },
});