import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { borderRadius, colors, spacing } from '../../theme';
import AppModal from './AppModal';
import ModalHeader from './ModalHeader';
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
  const selectedItem = items.find((item) => item.value === selectedValue);

  if (Platform.OS === 'android') {
    return (
      <View style={{ ...styles.container, ...containerStyle }}>
        {label ? <Text variant="label">{label}</Text> : null}
        <View style={{ ...styles.pickerContainer, ...(error ? styles.errorBorder : {}) }}>
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
            <Ionicons
              name="chevron-down"
              size={16}
              color={colors.secondary.main}
              style={styles.androidDropdownIcon}
            />
          </View>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <View style={{ ...styles.container, ...containerStyle }}>
      {label ? <Text variant="label">{label}</Text> : null}
      <TouchableOpacity
        style={{ ...styles.pickerContainer, ...(error ? styles.errorBorder : {}) }}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.pickerContent}>
          <Text style={styles.selectedText}>
            {selectedItem ? selectedItem.label : 'Select an option'}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.secondary.main} />
        </View>
      </TouchableOpacity>

      <AppModal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        presentation="bottom"
        panelStyle={styles.modalContent}
      >
        <ModalHeader
          title={label ?? 'Select an option'}
          showDivider
          rightContent={(
            <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={0.7}>
              <Text color={colors.secondary.main} style={styles.doneButton}>
                Done
              </Text>
            </TouchableOpacity>
          )}
        />

        <RNPicker
          selectedValue={selectedValue}
          onValueChange={(value) => {
            onValueChange(value as string | number, 0);
          }}
          style={styles.iosPicker}
        >
          {items.map((item) => (
            <RNPicker.Item
              key={item.value.toString()}
              label={item.label}
              value={item.value}
              color="#000000"
            />
          ))}
        </RNPicker>
      </AppModal>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  modalContent: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
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
