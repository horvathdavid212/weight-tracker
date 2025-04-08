import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Alert, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {WeightEntry} from '../types/WeightEntry';
import {useFocusEffect} from "@react-navigation/native";

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
            // Get current entries, add the new entry, and update AsyncStorage.
            const storedEntries = await AsyncStorage.getItem('weightEntries');
            const entries: WeightEntry[] = storedEntries ? JSON.parse(storedEntries) : [];
            const updatedEntries = [newEntry, ...entries];
            await AsyncStorage.setItem('weightEntries', JSON.stringify(updatedEntries));
            // Notify parent of the new entry and clear the input.
            onNewEntry(newEntry);
            setWeight('');
        } catch (error) {
            console.error('Error saving weight entry:', error);
            Alert.alert('Error', 'There was a problem saving your weight. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                Enter weight (kg)
            </Text>

            <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder={
                    nextReminder
                        ? `Weight log due: ${new Date(nextReminder).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            hour12: true,
                        })}`
                        : ""
                }
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={saveWeight}
            />
            <Button title="Save" onPress={saveWeight} disabled={loading || weight.trim() === ''}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    reminderText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 4,
    },
});

export default WeightInput;
