import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle, Platform, TouchableOpacity, Modal } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { colors, spacing, borderRadius } from '../../theme';
import Text from './Text';

interface PickerItem {
  label: string;
  value: string | number;
}

interface PickerProps {
  label?: string;
  selectedValue: string | number;
  onValueChange: (itemValue: string | number, itemIndex: number) => void;
  items: PickerItem[];
  containerStyle?: ViewStyle;
  error?: string;
}

const Picker: React.FC<PickerProps> = ({
  label,
  selectedValue,
  onValueChange,
  items,
  containerStyle,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Find the selected item to display its label
  const selectedItem = items.find(item => item.value === selectedValue);

  // Android uses the native picker which works fine with our styling
  if (Platform.OS === 'android') {
    return (
      <View style={{...styles.container, ...containerStyle}}>
        {label && <Text variant="label">{label}</Text>}
        <View style={{...styles.pickerContainer, ...(error ? styles.errorBorder : {})}}>
          <View style={styles.androidPickerWrapper}>
            <RNPicker
              selectedValue={selectedValue}
              onValueChange={(itemValue, itemIndex) =>
                onValueChange(itemValue as string | number, itemIndex)
              }
              style={styles.picker}
              dropdownIconColor={colors.secondary.main}
              mode="dropdown"
            >
              {items.map((item) => (
                <RNPicker.Item
                  key={item.value.toString()}
                  label={item.label}
                  value={item.value}
                  color={colors.text.primary}
                />
              ))}
            </RNPicker>
            <Text style={{...styles.dropdownIcon, ...styles.androidDropdownIcon}}>▼</Text>
          </View>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  // iOS needs a custom implementation for better visibility in dark mode
  return (
    <View style={{...styles.container, ...containerStyle}}>
      {label && <Text variant="label">{label}</Text>}
      <TouchableOpacity
        style={{...styles.pickerContainer, ...(error ? styles.errorBorder : {})}}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.pickerContent}>
          <Text style={styles.selectedText}>
            {selectedItem ? selectedItem.label : 'Select an option'}
          </Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text color={colors.secondary.main} style={styles.doneButton}>Done</Text>
              </TouchableOpacity>
            </View>

            <RNPicker
              selectedValue={selectedValue}
              onValueChange={(value) => {
                onValueChange(value as string | number, 0);
                // Don't close modal on iOS as users expect to see the picker wheel
              }}
              style={styles.iosPicker}
            >
              {items.map((item) => (
                <RNPicker.Item
                  key={item.value.toString()}
                  label={item.label}
                  value={item.value}
                  color="#000000" // Black text for iOS picker
                />
              ))}
            </RNPicker>
          </View>
        </TouchableOpacity>
      </Modal>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.tertiary.main,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.elevated,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  pickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  dropdownIcon: {
    color: colors.secondary.main,
    fontSize: 12,
  },
  androidPickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  androidDropdownIcon: {
    position: 'absolute',
    right: 10,
    pointerEvents: 'none',
  },
  picker: {
    color: colors.text.primary,
    height: 50,
  },
  selectedText: {
    color: colors.text.primary,
    fontSize: 16,
    paddingVertical: spacing.sm,
  },
  errorBorder: {
    borderColor: colors.status.error,
  },
  errorText: {
    color: colors.status.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  doneButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  iosPicker: {
    height: 200,
  },
});

export default Picker;
