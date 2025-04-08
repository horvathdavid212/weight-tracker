import React, {useState} from 'react';
import {StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {WeightEntry} from '../types/WeightEntry';
import {useFocusEffect} from "@react-navigation/native";
import {WeightDataService} from '../services/WeightDataService';
import {Card, Input, Button, Text} from './ui';
import {colors, spacing} from '../theme';

interface WeightInputProps {
    onNewEntry: (entry: WeightEntry) => void;
}

const WeightInput: React.FC<WeightInputProps> = ({onNewEntry}) => {
    const [weight, setWeight] = useState('');
    const [loading, setLoading] = useState(false);
    const [nextReminder, setNextReminder] = useState<string | null>(null);

    // Fetch the next reminder date on component mount.
    useFocusEffect(
        React.useCallback(() => {
            const fetchNextReminder = async () => {
                try {
                    const storedReminder = await AsyncStorage.getItem('nextReminder');
                    if (storedReminder) {
                        setNextReminder(storedReminder);
                    }
                } catch (error) {
                    console.error('Error fetching next reminder:', error);
                }
            };
            fetchNextReminder();
        }, [])
    );

    const saveWeight = async () => {
        const parsedWeight = parseFloat(weight);
        if (isNaN(parsedWeight)) {
            Alert.alert('Invalid Input', 'Please enter a valid weight.');
            return;
        }

        const newEntry: WeightEntry = {
            date: new Date().toISOString(),
            weight: parsedWeight,
        };

        try {
            setLoading(true);
            // Use the data service to save the entry
            const success = await WeightDataService.addEntry(newEntry);

            if (success) {
                // Notify parent of the new entry and clear the input
                onNewEntry(newEntry);
                setWeight('');
            } else {
                Alert.alert('Error', 'There was a problem saving your weight. Please try again.');
            }
        } catch (error) {
            console.error('Error saving weight entry:', error);
            Alert.alert('Error', 'There was a problem saving your weight. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const reminderText = nextReminder
        ? `Weight log due: ${new Date(nextReminder).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            hour12: true,
        })}`
        : "";

    return (
        <Card variant="elevated" style={styles.container}>
            <Text variant="h3" color={colors.secondary.main} style={styles.title}>
                Track Your Weight
            </Text>

            {nextReminder && (
                <Text variant="caption" style={styles.reminderText}>
                    {reminderText}
                </Text>
            )}

            <Input
                label="Enter weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={saveWeight}
                containerStyle={styles.inputContainer}
            />

            <Button
                title="Save Weight"
                onPress={saveWeight}
                disabled={loading || weight.trim() === ''}
                loading={loading}
                variant="secondary"
                fullWidth
            />
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
        backgroundColor: colors.background.paper,
        borderTopWidth: 4,
        borderTopColor: colors.secondary.main,
    },
    title: {
        marginBottom: spacing.md,
    },
    reminderText: {
        color: colors.text.secondary,
        marginBottom: spacing.md,
    },
    inputContainer: {
        marginBottom: spacing.md,
    },
});

export default WeightInput;
