import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {scheduleReminder} from '../notifications/scheduler';
import {Dropdown, Text} from './ui';
import {colors, spacing} from '../theme';

const ReminderPicker: React.FC = () => {
    const [reminderFrequency, setReminderFrequency] = useState<string | number>('disabled');

    useEffect(() => {
        (async () => {
            const value = await AsyncStorage.getItem('reminderFrequency');
            if (value) setReminderFrequency(value);
        })();
    }, []);

    const onValueChange = async (value: string | number) => {
        // Ensure value is a string for AsyncStorage
        const stringValue = value.toString();
        setReminderFrequency(value); // Keep the original value type for the state
        await AsyncStorage.setItem('reminderFrequency', stringValue);
        await scheduleReminder(stringValue);
    };

    const reminderOptions = [
        {label: "Disabled", value: "disabled"},
        {label: "Now", value: "now"},
        {label: "Daily", value: "daily"},
        {label: "Weekly", value: "weekly"},
        {label: "Monthly", value: "monthly"}
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
                onValueChange={onValueChange}
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
