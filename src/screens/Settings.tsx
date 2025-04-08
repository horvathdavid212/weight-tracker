import React from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReminderPicker from '../components/ReminderPicker';
import GoalCalculator from '../components/GoalCalculator';

const Settings: React.FC = () => {
    const clearReminderSettings = async () => {
        try {
            await AsyncStorage.removeItem('reminderFrequency');
            Alert.alert('Success', 'Reminder settings cleared.');
        } catch (error) {
            console.error('Error clearing reminder settings:', error);
            Alert.alert('Error', 'Failed to clear reminder settings.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Weight Goal</Text>
                <GoalCalculator />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reminder Settings</Text>
                <ReminderPicker />
            </View>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Other Settings</Text>
                <Button title="Clear Reminder Settings" onPress={clearReminderSettings} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#444',
    },
});

export default Settings;
