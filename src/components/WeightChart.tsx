import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { WeightEntry } from '../types/WeightEntry';

type WeightChartProps = {
    entries: WeightEntry[];
};

export default function WeightChart({ entries }: WeightChartProps) {
    if (entries.length < 2) return null;

    const data = {
        labels: entries.slice(0, 7).reverse().map(e => e.date.split('T')[0]),
        datasets: [
            {
                data: entries.slice(0, 7).reverse().map(e => e.weight),
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
