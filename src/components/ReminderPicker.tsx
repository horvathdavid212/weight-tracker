import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleReminder } from '../notifications/scheduler';

const ReminderPicker: React.FC = () => {
    const [reminderFrequency, setReminderFrequency] = useState('disabled');

    useEffect(() => {
        (async () => {
            const value = await AsyncStorage.getItem('reminderFrequency');
            if (value) setReminderFrequency(value);
        })();
    }, []);

    const onValueChange = async (value: string) => {
        setReminderFrequency(value);
        await AsyncStorage.setItem('reminderFrequency', value);
        await scheduleReminder(value);
    };

    return (
        <View>
            <Text style={styles.label}>Reminder Frequency</Text>
            <Picker
                selectedValue={reminderFrequency}
                onValueChange={onValueChange}
                style={styles.picker}
            >
                <Picker.Item label="Disabled" value="disabled" />
                <Picker.Item label="Now" value="now" />
                <Picker.Item label="Daily" value="daily" />
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Monthly" value="monthly" />
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 6,
        color: '#333',
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        backgroundColor: '#f9f9f9',
        marginBottom: 20,
    },
});

export default ReminderPicker;
