import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import ReminderPicker from '../components/ReminderPicker';
import GoalCalculator from '../components/GoalCalculator';
import { Container, Text, Button, SectionCard } from '../components/ui';
import { colors, spacing } from '../theme';
import {
    useReminderSettings,
} from '../features/reminders/useReminderSettings';
import { ReminderFrequency } from '../features/reminders/types';

const Settings: React.FC = () => {
    const {
        reminderFrequency,
        updateReminderFrequency,
        clearReminderSettings,
    } = useReminderSettings();

    const handleReminderChange = async (value: ReminderFrequency) => {
        try {
            await updateReminderFrequency(value);
        } catch (error) {
            console.error('Error updating reminder settings:', error);
            Alert.alert(
                'Error',
                error instanceof Error
                    ? error.message
                    : 'Failed to update reminder settings.'
            );
        }
    };

    const handleClearReminderSettings = async () => {
        try {
            await clearReminderSettings();
            Alert.alert('Success', 'Reminder settings cleared.');
        } catch (error) {
            console.error('Error clearing reminder settings:', error);
            Alert.alert('Error', 'Failed to clear reminder settings.');
        }
    };

    return (
        <Container scrollable style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text variant="h1" color={colors.secondary.main} style={styles.title}>
                Settings
            </Text>

            <SectionCard title="Weight Goal" style={styles.section}>
                <GoalCalculator />
            </SectionCard>

            <SectionCard title="Reminder Settings" style={styles.section}>
                <ReminderPicker
                    reminderFrequency={reminderFrequency}
                    onValueChange={handleReminderChange}
                />
            </SectionCard>

            <SectionCard
                title="Other Settings"
                style={styles.section}
                contentStyle={styles.otherButtonContainer}
            >
                <View>
                    <Button
                        title="Clear Reminder Settings"
                        onPress={handleClearReminderSettings}
                        variant="tertiary"
                        fullWidth
                    />
                </View>
            </SectionCard>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.main,
    },
    contentContainer: {
        backgroundColor: colors.background.main,
        paddingBottom: spacing.xl,
    },
    title: {
        marginBottom: spacing.lg,
    },
    section: {
        marginBottom: spacing.lg,
    },
    otherButtonContainer: {
        padding: spacing.md,
    },
});

export default Settings;
