import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { colors, spacing, borderRadius } from '../../theme';
import Text from './Text';

interface PickerItem {
  label: string;
  value: string | number;
}

interface SimplePickerProps {
  label?: string;
  selectedValue: string | number;
  onValueChange: (itemValue: any, itemIndex: number) => void;
  items: PickerItem[];
}

const SimplePicker: React.FC<SimplePickerProps> = ({
  label,
  selectedValue,
  onValueChange,
  items,
}) => {
  // Find the selected item to display its label
  const selectedItem = items.find(item => item.value === selectedValue);

  return (
    <View style={styles.container}>
      {label && <Text variant="label">{label}</Text>}

      {/* Display the selected value above the picker for better visibility */}
      {selectedItem && (
        <View style={styles.selectedValueContainer}>
          <Text variant="body1" color={colors.secondary.main} style={styles.selectedValueText}>
            Selected: {selectedItem.label}
          </Text>
        </View>
      )}

      <View style={styles.pickerContainer}>
        {Platform.OS === 'android' && (
          <View style={styles.androidPickerWrapper}>
            <RNPicker
              selectedValue={selectedValue}
              onValueChange={onValueChange}
              style={styles.picker}
              dropdownIconColor={colors.secondary.main}
              mode="dropdown"
            >
              {items.map((item) => (
                <RNPicker.Item
                  key={item.value.toString()}
                  label={item.label}
                  value={item.value}
                  color="#FFFFFF" // White text for better visibility
                />
              ))}
            </RNPicker>
            <Text style={{...styles.dropdownIcon}}>▼</Text>
          </View>
        )}

        {Platform.OS === 'ios' && (
          <RNPicker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            style={styles.picker}
            itemStyle={styles.iosPickerItem} // iOS specific item styling
          >
            {items.map((item) => (
              <RNPicker.Item
                key={item.value.toString()}
                label={item.label}
                value={item.value}
                color="#FFFFFF" // White text for better visibility
              />
            ))}
          </RNPicker>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  selectedValueContainer: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  selectedValueText: {
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.tertiary.main,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.elevated,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  picker: {
    color: colors.text.primary,
    height: 50,
  },
  androidPickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  dropdownIcon: {
    position: 'absolute',
    right: spacing.md,
    color: colors.secondary.main,
    fontSize: 12,
  },
  iosPickerItem: {
    color: colors.text.primary,
    fontSize: 16,
  },
});

export default SimplePicker;
