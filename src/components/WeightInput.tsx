import React, {useState, useMemo} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {WeightEntry} from '../types/WeightEntry';
import {generateWeightEntryId} from '../services/WeightDataService';
import {Card, Input, Button, Text} from './ui';
import {colors, spacing} from '../theme';
import {useReminderSettings} from '../features/reminders/useReminderSettings';
import {
    formatShortDateTime,
    formatShortTime,
    isToday,
    isTomorrow,
} from '../utils/dateFormat';
import {parseAndValidateWeightInput} from '../utils/weightValidation';

interface WeightInputProps {
    onNewEntry: (entry: WeightEntry) => Promise<boolean>;
}

const WeightInput: React.FC<WeightInputProps> = ({onNewEntry}) => {
    const [weight, setWeight] = useState('');
    const [loading, setLoading] = useState(false);

    const {nextReminder} = useReminderSettings();

    const saveWeight = async () => {
        const {value: parsedWeight, error} = parseAndValidateWeightInput(weight);
        if (error || parsedWeight === null) {
            Alert.alert('Invalid Input', error ?? 'Please enter a valid weight.');
            return;
        }

        const newEntry: WeightEntry = {
            id: generateWeightEntryId(),
            date: new Date().toISOString(),
            weight: parsedWeight,
        };

        try {
            setLoading(true);
            const success = await onNewEntry(newEntry);

            if (success) {
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

        // Create a more descriptive message
        if (isToday(reminderDate, now)) {
            return `Next reminder: Today at ${formatShortTime(reminderDate)}`;
        }

        if (isTomorrow(reminderDate, now)) {
            return `Next reminder: Tomorrow at ${formatShortTime(reminderDate)}`;
        }

        return `Next reminder: ${formatShortDateTime(reminderDate)}`;
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
