import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { WeightEntry } from '../types/WeightEntry';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                strokeWidth: 2,
            },
            {
                data: goalLine,
                color: (opacity = 1) => `rgba(120, 176, 60, ${opacity})`, // Red color for goal line
                strokeWidth: 1,
                dotted: true,
            },
        ],
        legend: ['Actual Weight', 'Goal']
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
                propsForDots: {
                    r: '4',
                    strokeWidth: '1',
                    stroke: '#333',
                },
                propsForBackgroundLines: {
                    strokeDasharray: '', 
                },
                useShadowColorFromDataset: true
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