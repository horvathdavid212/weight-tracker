import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReminderPicker from '../components/ReminderPicker';

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
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reminder Settings</Text>
                <ReminderPicker />
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Other Settings</Text>
                <Button title="Clear Reminder Settings" onPress={clearReminderSettings} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    section: {
        marginBottom: 30
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10
    },
});

export default Settings;
