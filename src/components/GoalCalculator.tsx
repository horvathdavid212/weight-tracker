import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Button, Input, Text, Card, Dropdown, FormActions} from './ui';
import {colors, spacing} from '../theme';
import { DEFAULT_WEIGHT_LOSS_RATE } from '../features/goals/goalService';
import { useGoal } from '../features/goals/useGoal';
import { formatLongDate } from '../utils/dateFormat';
import { formatWeight } from '../utils/weightFormat';
import { parseAndValidateWeightInput } from '../utils/weightValidation';

const WEIGHT_LOSS_RATES = [
    {label: '0.5 kg per week', value: 0.5},
    {label: '0.75 kg per week', value: 0.75},
    {label: '1.0 kg per week', value: 1.0},
];

const GoalCalculator: React.FC = () => {
    const { goalData, saveGoal, clearGoal } = useGoal();
    const [currentWeight, setCurrentWeight] = useState('');
    const [goalWeight, setGoalWeight] = useState('');
    const [weightLossRate, setWeightLossRate] = useState(DEFAULT_WEIGHT_LOSS_RATE);

    useEffect(() => {
        if (goalData) {
            setCurrentWeight(goalData.currentWeight.toString());
            setGoalWeight(goalData.goalWeight.toString());
            setWeightLossRate(goalData.weightLossRate);
            return;
        }

        setCurrentWeight('');
        setGoalWeight('');
        setWeightLossRate(DEFAULT_WEIGHT_LOSS_RATE);
    }, [goalData]);

    const handleCalculate = async () => {
        const currentWeightResult = parseAndValidateWeightInput(currentWeight, {
            fieldLabel: 'current weight',
        });
        if (currentWeightResult.error || currentWeightResult.value === null) {
            Alert.alert('Error', currentWeightResult.error ?? 'Please enter a valid current weight.');
            return;
        }

        const goalWeightResult = parseAndValidateWeightInput(goalWeight, {
            fieldLabel: 'goal weight',
        });
        if (goalWeightResult.error || goalWeightResult.value === null) {
            Alert.alert('Error', goalWeightResult.error ?? 'Please enter a valid goal weight.');
            return;
        }

        try {
            await saveGoal({
                currentWeight: currentWeightResult.value,
                goalWeight: goalWeightResult.value,
                weightLossRate,
            });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Failed to save goal data';
            Alert.alert('Error', message);
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
                    onPress: async () => {
                        try {
                            await clearGoal();
                        } catch (error) {
                            const message =
                                error instanceof Error
                                    ? error.message
                                    : 'Failed to clear goal data';
                            Alert.alert('Error', message);
                        }
                    },
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
                    onValueChange={(itemValue) => {
                        // Ensure we're setting a number value
                        const numValue = typeof itemValue === 'string' ? parseFloat(itemValue) : itemValue;
                        setWeightLossRate(numValue);
                    }}
                    items={weightLossRateOptions}
                />

                <FormActions style={styles.buttonGroup}>
                    <Button
                        title="Calculate Goal Date"
                        onPress={handleCalculate}
                        variant="secondary"
                        fullWidth
                    />

                    <Button
                        title="Clear Goal"
                        onPress={handleClearGoal}
                        variant="outline"
                        fullWidth
                    />
                </FormActions>
            </View>

            {goalData && (
                <Card variant="elevated" style={styles.recommendationContainer}>
                    <Text variant="body1" style={styles.recommendationText}>
                        Recommended achievement date:
                    </Text>
                    <Text variant="h3" color={colors.secondary.main} style={styles.dateText}>
                        {formatLongDate(goalData.goalDate)}
                    </Text>
                    <Text variant="caption" style={styles.recommendationSubtext}>
                        Based on {formatWeight(goalData.weightLossRate, 2)} kg weight loss per week
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
