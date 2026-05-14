import React, { useState } from 'react';
import {
    Alert,
    View,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    TouchableOpacity,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { WeightEntry } from '../types/WeightEntry';
import { Button, Input, Text, Card } from './ui';
import { colors, spacing, borderRadius } from '../theme';
import { formatLongDate } from '../utils/dateFormat';
import { parseAndValidateWeightInput } from '../utils/weightValidation';

interface EditEntryProps {
    entry: WeightEntry;
    visible: boolean;
    onSave: (updatedEntry: WeightEntry) => void;
    onDelete: (id: string) => void;
    onCancel: () => void;
}

const EditEntry: React.FC<EditEntryProps> = ({ entry, visible, onSave, onDelete, onCancel }) => {
    const [editedWeight, setEditedWeight] = useState(entry.weight.toString());
    const [editedDate, setEditedDate] = useState(new Date(entry.date));
    const [showDatePicker, setShowDatePicker] = useState(false);

    const saveEditedEntry = () => {
        const { value: parsedWeight, error } = parseAndValidateWeightInput(editedWeight);
        if (error || parsedWeight === null) {
            Keyboard.dismiss();
            Alert.alert('Invalid Input', error ?? 'Please enter a valid weight.');
            return;
        }

        const updatedEntry: WeightEntry = {
            id: entry.id,
            weight: parsedWeight,
            date: editedDate.toISOString(),
        };
        onSave(updatedEntry);
    };

    const onDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setEditedDate(selectedDate);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onCancel}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <Card variant="elevated" style={styles.modalContainer}>
                        <Text variant="h3" color={colors.secondary.main} style={styles.header}>
                            Edit Entry
                        </Text>

                        <Input
                            label="Weight (kg)"
                            value={editedWeight}
                            onChangeText={setEditedWeight}
                            placeholder="Enter weight"
                            keyboardType="numeric"
                            containerStyle={styles.inputGroup}
                        />

                        <View style={styles.inputGroup}>
                            <Text variant="label">Date</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                style={styles.dateButton}
                            >
                                <Text style={styles.dateButtonText}>
                                    {formatLongDate(editedDate)}
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

                        <View style={styles.buttonGroup}>
                            <Button
                                title="Save Changes"
                                onPress={saveEditedEntry}
                                variant="secondary"
                                fullWidth
                                style={styles.buttonContainer}
                            />

                            <Button
                                title="Delete Entry"
                                onPress={() => onDelete(entry.id)}
                                variant="tertiary"
                                fullWidth
                                style={styles.buttonContainer}
                            />

                            <Button
                                title="Cancel"
                                onPress={onCancel}
                                variant="outline"
                                fullWidth
                                style={styles.buttonContainer}
                            />
                        </View>
                    </Card>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: colors.background.paper,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.md,
        borderLeftWidth: 4,
        borderLeftColor: colors.secondary.main,
    },
    header: {
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: spacing.md,
    },
    dateButton: {
        borderWidth: 1,
        borderColor: colors.tertiary.main,
        borderRadius: borderRadius.sm,
        padding: spacing.md,
        backgroundColor: colors.background.elevated,
    },
    dateButtonText: {
        fontSize: 16,
        color: colors.text.primary,
    },
    buttonGroup: {
        marginTop: spacing.md,
    },
    buttonContainer: {
        marginTop: spacing.sm,
    },
});

export default EditEntry;
