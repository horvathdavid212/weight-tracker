import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import ReminderPicker from '../components/ReminderPicker';
import GoalCalculator from '../components/GoalCalculator';
import { Container, Text, Card, Button } from '../components/ui';
import { colors, spacing } from '../theme';
import {
    clearReminderSchedule,
    isReminderFrequency,
    ReminderFrequency,
    scheduleReminder,
} from '../notifications/scheduler';
import { asyncStorageClient } from '../storage/asyncStorageClient';
import { STORAGE_KEYS } from '../storage/storageKeys';

const Settings: React.FC = () => {
    const [reminderFrequency, setReminderFrequency] = React.useState<ReminderFrequency>('disabled');

    React.useEffect(() => {
        let isMounted = true;

        const loadReminderFrequency = async () => {
            try {
                const storedFrequency = await asyncStorageClient.getString(STORAGE_KEYS.reminderFrequency);
                if (isMounted && isReminderFrequency(storedFrequency)) {
                    setReminderFrequency(storedFrequency);
                }
            } catch (error) {
                console.error('Error loading reminder settings:', error);
            }
        };

        void loadReminderFrequency();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleReminderChange = async (value: ReminderFrequency) => {
        try {
            setReminderFrequency(value);

            if (value === 'disabled') {
                await clearReminderSchedule();
                return;
            }

            await asyncStorageClient.setString(STORAGE_KEYS.reminderFrequency, value);
            await scheduleReminder(value);
        } catch (error) {
            console.error('Error updating reminder settings:', error);
            Alert.alert('Error', 'Failed to update reminder settings.');
        }
    };

    const clearReminderSettings = async () => {
        try {
            await clearReminderSchedule();
            setReminderFrequency('disabled');
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

            <Card variant="elevated" style={{...styles.section, ...styles.goalCard}}>
                <Text variant="h3" color={colors.secondary.main} style={styles.sectionTitle}>
                    Weight Goal
                </Text>
                <GoalCalculator />
            </Card>

            <Card variant="elevated" style={{...styles.section, ...styles.reminderCard}}>
                <Text variant="h3" color={colors.secondary.main} style={styles.sectionTitle}>
                    Reminder Settings
                </Text>
                <ReminderPicker
                    reminderFrequency={reminderFrequency}
                    onValueChange={handleReminderChange}
                />
            </Card>

            <Card variant="elevated" style={{...styles.section, ...styles.otherCard}}>
                <Text variant="h3" color={colors.secondary.main} style={styles.sectionTitle}>
                    Other Settings
                </Text>
                <View style={styles.otherButtonContainer}>
                    <Button
                        title="Clear Reminder Settings"
                        onPress={clearReminderSettings}
                        variant="tertiary"
                        fullWidth
                    />
                </View>
            </Card>
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
        padding: 0,
        overflow: 'hidden',
        backgroundColor: colors.background.paper,
    },
    sectionTitle: {
        marginBottom: spacing.md,
        padding: spacing.md,
        paddingBottom: 0,
    },
    goalCard: {
        borderTopWidth: 4,
        borderTopColor: colors.secondary.main,
    },
    reminderCard: {
        borderTopWidth: 4,
        borderTopColor: colors.secondary.main,
    },
    otherCard: {
        borderTopWidth: 4,
        borderTopColor: colors.secondary.main,
    },
    otherButtonContainer: {
        padding: spacing.md,
    },
});

export default Settings;
