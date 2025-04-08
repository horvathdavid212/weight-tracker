import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { WeightEntry } from '../types/WeightEntry';

interface EditEntryProps {
    entry: WeightEntry;
    index: number;
    visible: boolean;
    onSave: (index: number, updatedEntry: WeightEntry) => void;
    onDelete: (index: number) => void;
    onCancel: () => void;
}

const EditEntry: React.FC<EditEntryProps> = ({ entry, index, visible, onSave, onDelete, onCancel }) => {
    const [editedWeight, setEditedWeight] = useState(entry.weight.toString());
    const [editedDate, setEditedDate] = useState(new Date(entry.date));
    const [showDatePicker, setShowDatePicker] = useState(false);

    const saveEditedEntry = () => {
        const updatedEntry: WeightEntry = {
            weight: parseFloat(editedWeight),
            date: editedDate.toISOString(),
        };
        onSave(index, updatedEntry);
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setEditedDate(selectedDate);
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Modal
            visible={visible}
            animationType="none"
            transparent={true}
            onRequestClose={onCancel}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.header}>Edit Entry</Text>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Weight (kg)</Text>
                            <TextInput
                                value={editedWeight}
                                onChangeText={setEditedWeight}
                                placeholder="Enter weight"
                                keyboardType="numeric"
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Date</Text>
                            <TouchableOpacity 
                                onPress={() => setShowDatePicker(true)}
                                style={styles.dateButton}
                            >
                                <Text style={styles.dateButtonText}>
                                    {formatDate(editedDate)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {showDatePicker && (
                            <DateTimePicker
                                value={editedDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={onDateChange}
                                maximumDate={new Date()}
                            />
                        )}
                        <View style={styles.buttonContainer}>
                            <Button title="Save Changes" onPress={saveEditedEntry} />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title="Delete Entry" onPress={() => onDelete(index)} color="red" />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title="Cancel" onPress={onCancel} color="#999" />
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 30,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        marginBottom: 5,
        color: '#555',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fafafa',
    },
    dateButtonText: {
        fontSize: 16,
        color: '#333',
    },
    buttonContainer: {
        marginTop: 10,
    },
});

export default EditEntry;
