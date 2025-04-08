import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
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
  const selectedItem = items.find(item => item.value === selectedValue);

  const handleSelect = (value: string | number) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text variant="label">{label}</Text>}

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.selectedText}>
          {selectedItem ? selectedItem.label : 'Select an option'}
        </Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text variant="h3" color={colors.secondary.main} style={styles.modalTitle}>
                Select an option
              </Text>

              <FlatList
                data={items}
                keyExtractor={(item) => item.value.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      ...styles.optionItem,
                      ...(item.value === selectedValue ? styles.selectedItem : {}),
                    }}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text
                      style={{
                        ...styles.optionText,
                        ...(item.value === selectedValue ? styles.selectedItemText : {}),
                      }}
                    >
                      {item.label}
                    </Text>
                    {item.value === selectedValue && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  dropdownIcon: {
    color: colors.secondary.main,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary.main,
  },
  modalTitle: {
    marginBottom: spacing.md,
    textAlign: 'center',
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
  checkmark: {
    color: colors.secondary.main,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Dropdown;
