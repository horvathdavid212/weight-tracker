import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Alert, Text, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {WeightEntry} from '../types/WeightEntry';
import {useFocusEffect} from "@react-navigation/native";
import {WeightDataService} from '../services/WeightDataService';

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
            <View style={styles.buttonContainer}>
                {loading ? (
                    <ActivityIndicator size="small" color="#2196F3" />
                ) : (
                    <Button
                        title="Save"
                        onPress={saveWeight}
                        disabled={loading || weight.trim() === ''}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
        color: '#333',
    },
    reminderText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        marginBottom: 15,
        borderRadius: 6,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    buttonContainer: {
        height: 40,
        justifyContent: 'center',
    },
});

export default WeightInput;
