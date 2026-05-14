import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Dropdown, Text} from './ui';
import {colors, spacing} from '../theme';
import {ReminderFrequency} from '../features/reminders/types';

interface ReminderPickerProps {
    reminderFrequency: ReminderFrequency;
    onValueChange: (value: ReminderFrequency) => void;
}

const ReminderPicker: React.FC<ReminderPickerProps> = ({
    reminderFrequency,
    onValueChange,
}) => {
    const reminderOptions = [
        {label: 'Disabled', value: 'disabled'},
        {label: 'Now', value: 'now'},
        {label: 'Daily', value: 'daily'},
        {label: 'Weekly', value: 'weekly'},
        {label: 'Monthly', value: 'monthly'}
    ];

    return (
        <View style={styles.container}>
            <Text variant="caption" color={colors.text.secondary} style={styles.helperText}>
                Set how often you want to be reminded to log your weight.
                Daily reminders are recommended for consistent tracking.
            </Text>
            <Dropdown
                label="Reminder Frequency"
                selectedValue={reminderFrequency}
                onValueChange={(value) => onValueChange(value as ReminderFrequency)}
                items={reminderOptions}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
        backgroundColor: colors.background.paper,
    },
    helperText: {
        marginTop: spacing.xs,
        marginBottom: spacing.md,
    },
});

export default ReminderPicker;
