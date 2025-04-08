import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Input, Text, Card, Dropdown} from './ui';
import {colors, spacing} from '../theme';

interface GoalData {
    currentWeight: number;
    goalWeight: number;
    goalDate: string;
    weightLossRate: number;
}

const WEIGHT_LOSS_RATES = [
    {label: '0.5 kg per week', value: 0.5},
    {label: '0.75 kg per week', value: 0.75},
    {label: '1.0 kg per week', value: 1.0},
];

const GoalCalculator: React.FC = () => {
    const [currentWeight, setCurrentWeight] = useState('');
    const [goalWeight, setGoalWeight] = useState('');
    const [weightLossRate, setWeightLossRate] = useState(0.5);
    const [recommendedDate, setRecommendedDate] = useState<Date | null>(null);
    const [displayedRate, setDisplayedRate] = useState<number | null>(null);

    useEffect(() => {
        loadGoalData();
    }, []);

    const loadGoalData = async () => {
        try {
            const data = await AsyncStorage.getItem('goalData');
            if (data) {
                const parsed: GoalData = JSON.parse(data);
                setCurrentWeight(parsed.currentWeight.toString());
                setGoalWeight(parsed.goalWeight.toString());
                setWeightLossRate(parsed.weightLossRate);
            }
        } catch (error) {
            console.error('Error loading goal data:', error);
        }
    };

    const handleCalculate = async () => {
        const currentWeightNum = parseFloat(currentWeight);
        const goalWeightNum = parseFloat(goalWeight);

        if (isNaN(currentWeightNum) || isNaN(goalWeightNum)) {
            Alert.alert('Invalid Input', 'Please enter valid numbers for weights');
            return;
        }

        if (goalWeightNum >= currentWeightNum) {
            Alert.alert('Invalid Goal', 'Goal weight should be less than current weight');
            return;
        }

        const weightDifference = Math.abs(currentWeightNum - goalWeightNum);
        const weeksNeeded = weightDifference / weightLossRate;
        const calculatedDate = new Date();
        calculatedDate.setDate(calculatedDate.getDate() + (weeksNeeded * 7));

        try {
            const goalData: GoalData = {
                currentWeight: currentWeightNum,
                goalWeight: goalWeightNum,
                weightLossRate: weightLossRate,
                goalDate: calculatedDate.toISOString(),
            };

            await AsyncStorage.setItem('goalData', JSON.stringify(goalData));
            setRecommendedDate(calculatedDate);
            setDisplayedRate(weightLossRate);
        } catch (error) {
            console.error('Error saving goal data:', error);
            Alert.alert('Error', 'Failed to save goal data');
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const clearGoalData = async () => {
        try {
            await AsyncStorage.removeItem('goalData');
            setCurrentWeight('');
            setGoalWeight('');
            setWeightLossRate(0.5);
            setRecommendedDate(null);
            setDisplayedRate(null);
        } catch (error) {
            console.error('Error clearing goal data:', error);
            Alert.alert('Error', 'Failed to clear goal data');
        }
    };

    const handleClearGoal = () => {
        Alert.alert(
            'Clear Goal',
            'Are you sure you want to clear your weight goal?',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Clear',
                    onPress: clearGoalData,
                    style: 'destructive'
                }
            ]
        );
    };

    const weightLossRateOptions = WEIGHT_LOSS_RATES.map(rate => ({
        label: rate.label,
        value: rate.value
    }));

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Input
                    label="Current Weight (kg)"
                    value={currentWeight}
                    onChangeText={setCurrentWeight}
                    keyboardType="numeric"
                    placeholder="Enter current weight"
                    containerStyle={styles.inputContainer}
                />

                <Input
                    label="Goal Weight (kg)"
                    value={goalWeight}
                    onChangeText={setGoalWeight}
                    keyboardType="numeric"
                    placeholder="Enter goal weight"
                    containerStyle={styles.inputContainer}
                />

                <Dropdown
                    label="Weight Loss Rate"
                    selectedValue={weightLossRate}
                    onValueChange={(itemValue) => setWeightLossRate(itemValue)}
                    items={weightLossRateOptions}
                />

                <View style={styles.buttonGroup}>
                    <Button
                        title="Calculate Goal Date"
                        onPress={handleCalculate}
                        variant="secondary"
                        fullWidth
                        style={styles.buttonContainer}
                    />

                    <Button
                        title="Clear Goal"
                        onPress={handleClearGoal}
                        variant="outline"
                        fullWidth
                        style={styles.buttonContainer}
                    />
                </View>
            </View>

            {recommendedDate && (
                <Card variant="elevated" style={styles.recommendationContainer}>
                    <Text variant="body1" style={styles.recommendationText}>
                        Recommended achievement date:
                    </Text>
                    <Text variant="h3" color={colors.secondary.main} style={styles.dateText}>
                        {formatDate(recommendedDate)}
                    </Text>
                    <Text variant="caption" style={styles.recommendationSubtext}>
                        Based on {displayedRate} kg weight loss per week
                    </Text>
                </Card>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
        backgroundColor: colors.background.paper,
    },
    formContainer: {
        marginBottom: spacing.md,
    },
    inputContainer: {
        marginBottom: spacing.sm,
    },
    buttonGroup: {
        marginVertical: spacing.md,
    },
    buttonContainer: {
        marginBottom: spacing.sm,
    },
    recommendationContainer: {
        marginTop: spacing.md,
        padding: spacing.md,
        backgroundColor: colors.background.elevated,
        borderLeftWidth: 4,
        borderLeftColor: colors.secondary.main,
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    recommendationText: {
        marginBottom: spacing.xs,
    },
    dateText: {
        marginBottom: spacing.sm,
    },
    recommendationSubtext: {
        fontStyle: 'italic',
    },
});

export default GoalCalculator;