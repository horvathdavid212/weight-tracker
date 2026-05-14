import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { borderRadius, colors, spacing } from '../../theme';
import AppModal from './AppModal';
import ModalHeader from './ModalHeader';
import Text from './Text';

interface DropdownItem {
  label: string;
  value: string | number;
}

interface DropdownProps {
  label?: string;
  selectedValue: string | number;
  onValueChange: (value: string | number) => void;
  items: DropdownItem[];
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  selectedValue,
  onValueChange,
  items,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedItem = items.find((item) => item.value === selectedValue);

  const handleSelect = (value: string | number) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {label ? <Text variant="label">{label}</Text> : null}

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.selectedText}>
          {selectedItem ? selectedItem.label : 'Select an option'}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.secondary.main} />
      </TouchableOpacity>

      <AppModal
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
        panelStyle={styles.modalContent}
      >
        <ModalHeader
          title={label ?? 'Select an option'}
          titleAlign="center"
          style={styles.modalHeader}
        />

        <FlatList
          data={items}
          keyExtractor={(item) => item.value.toString()}
          renderItem={({ item }) => {
            const isSelected = item.value === selectedValue;

            return (
              <TouchableOpacity
                style={[
                  styles.optionItem,
                  isSelected ? styles.selectedItem : null,
                ]}
                onPress={() => handleSelect(item.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected ? styles.selectedItemText : null,
                  ]}
                >
                  {item.label}
                </Text>
                {isSelected ? (
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color={colors.secondary.main}
                  />
                ) : null}
              </TouchableOpacity>
            );
          }}
        />
      </AppModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.tertiary.main,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.elevated,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  selectedText: {
    color: colors.text.primary,
    fontSize: 16,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: colors.background.paper,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary.main,
  },
  modalHeader: {
    paddingBottom: spacing.sm,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.tertiary.dark,
  },
  selectedItem: {
    backgroundColor: colors.background.elevated,
  },
  optionText: {
    color: colors.text.primary,
    fontSize: 16,
  },
  selectedItemText: {
    color: colors.secondary.main,
    fontWeight: 'bold',
  },
});

export default Dropdown;
