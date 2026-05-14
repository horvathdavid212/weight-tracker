import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppModal, ModalHeader, Text } from '../ui';
import { borderRadius, colors, spacing } from '../../theme';
import { AsyncStorageEntry } from '../../storage/asyncStorageClient';

interface DebugStorageViewerProps {
  visible: boolean;
  storageData: AsyncStorageEntry[];
  onClose: () => void;
}

const DebugStorageViewer: React.FC<DebugStorageViewerProps> = ({
  visible,
  storageData,
  onClose,
}) => {
  return (
    <AppModal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      dismissOnBackdropPress={false}
      panelStyle={styles.storagePanel}
    >
      <ModalHeader title="Storage Contents" onClose={onClose} showDivider />

      <ScrollView style={styles.storageContent}>
        {storageData.map(([key, value], index) => (
          <View key={index} style={styles.storageItem}>
            <Text variant="body2" color={colors.secondary.main} style={styles.storageKey}>
              {key}
            </Text>
            <Text variant="caption" style={styles.storageValue}>
              {value ? (value.length > 100 ? `${value.substring(0, 100)}...` : value) : 'null'}
            </Text>
          </View>
        ))}

        {storageData.length === 0 ? (
          <Text variant="body1" style={styles.emptyText}>
            No data in storage
          </Text>
        ) : null}
      </ScrollView>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  storagePanel: {
    width: '90%',
    maxWidth: 800,
    maxHeight: '80%',
    backgroundColor: colors.background.paper,
  },
  storageContent: {
    padding: spacing.md,
  },
  storageItem: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background.main,
    borderRadius: borderRadius.sm,
  },
  storageKey: {
    marginBottom: spacing.xs,
  },
  storageValue: {
    fontFamily: 'monospace',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: spacing.lg,
    color: colors.text.secondary,
  },
});

export default DebugStorageViewer;
