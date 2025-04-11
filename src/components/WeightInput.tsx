import React, {useState, useMemo} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {WeightEntry} from '../types/WeightEntry';
import {WeightDataService} from '../services/WeightDataService';
import {Card, Input, Button, Text} from './ui';
import {colors, spacing} from '../theme';
import {useNextReminder} from '../hooks/useNextReminder';

interface WeightInputProps {
    onNewEntry: (entry: WeightEntry) => void;
}

const WeightInput: React.FC<WeightInputProps> = ({onNewEntry}) => {
    const [weight, setWeight] = useState('');
    const [loading, setLoading] = useState(false);

    // Use our custom hook to get and automatically update the next reminder
    const nextReminder = useNextReminder();

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

    // Format the reminder text with a more descriptive message
    const reminderText = useMemo(() => {
        if (!nextReminder) return "";

        const reminderDate = new Date(nextReminder);
        const now = new Date();

        // Format the date and time
        const formattedDate = reminderDate.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        // Check if the reminder is for today
        const isToday = reminderDate.getDate() === now.getDate() &&
                        reminderDate.getMonth() === now.getMonth() &&
                        reminderDate.getFullYear() === now.getFullYear();

        // Check if the reminder is for tomorrow
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const isTomorrow = reminderDate.getDate() === tomorrow.getDate() &&
                          reminderDate.getMonth() === tomorrow.getMonth() &&
                          reminderDate.getFullYear() === tomorrow.getFullYear();

        // Create a more descriptive message
        if (isToday) {
            return `Next reminder: Today at ${reminderDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })}`;
        } else if (isTomorrow) {
            return `Next reminder: Tomorrow at ${reminderDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })}`;
        } else {
            return `Next reminder: ${formattedDate}`;
        }
    }, [nextReminder]);

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
