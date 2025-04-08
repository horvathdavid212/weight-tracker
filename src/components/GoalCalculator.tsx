import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet, Alert, Button} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Weight Goal Calculator</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Current Weight (kg)</Text>
                <TextInput
                    style={styles.input}
                    value={currentWeight}
                    onChangeText={setCurrentWeight}
                    keyboardType="numeric"
                    placeholder="Enter current weight"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Goal Weight (kg)</Text>
                <TextInput
                    style={styles.input}
                    value={goalWeight}
                    onChangeText={setGoalWeight}
                    keyboardType="numeric"
                    placeholder="Enter goal weight"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Weight Loss Rate</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={weightLossRate}
                        onValueChange={(itemValue) => setWeightLossRate(itemValue)}
                    >
                        {WEIGHT_LOSS_RATES.map((rate) => (
                            <Picker.Item
                                key={rate.value}
                                label={rate.label}
                                value={rate.value}
                            />
                        ))}
                    </Picker>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title="Calculate Goal Date"
                    onPress={handleCalculate}
                />
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title="Clear Goal"
                    onPress={handleClearGoal}
                    color="red"
                />
            </View>

            {recommendedDate && (
                <View style={styles.recommendationContainer}>
                    <Text style={styles.recommendationText}>
                        Recommended achievement date: {formatDate(recommendedDate)}
                    </Text>
                    <Text style={styles.recommendationSubtext}>
                        Based on {displayedRate} kg weight loss per week
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        marginBottom: 16,
    },
    recommendationContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#f0f9ff',
        borderRadius: 8,
    },
    recommendationText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    recommendationSubtext: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    buttonContainer: {
        marginBottom: 10,
    }
});

export default GoalCalculator;