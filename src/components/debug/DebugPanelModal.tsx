import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppModal, Card, ModalHeader, Text } from '../ui';
import { colors, spacing } from '../../theme';
import { formatShortDate } from '../../utils/dateFormat';
import DebugDataActions from './DebugDataActions';

interface DebugPanelModalProps {
  visible: boolean;
  onClose: () => void;
  onAddSampleData: () => void;
  onGenerateYearData: () => void;
  onClearWeightData: () => void;
  onViewStorage: () => void;
  onClearAllStorage: () => void;
}

const DebugPanelModal: React.FC<DebugPanelModalProps> = ({
  visible,
  onClose,
  onAddSampleData,
  onGenerateYearData,
  onClearWeightData,
  onViewStorage,
  onClearAllStorage,
}) => {
  return (
    <AppModal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      dismissOnBackdropPress={false}
      panelStyle={styles.debugPanel}
    >
      <ModalHeader title="Debug Panel" onClose={onClose} showDivider />

      <ScrollView style={styles.content}>
        <DebugDataActions
          onAddSampleData={onAddSampleData}
          onGenerateYearData={onGenerateYearData}
          onClearWeightData={onClearWeightData}
          onViewStorage={onViewStorage}
          onClearAllStorage={onClearAllStorage}
        />

        <Card variant="outlined" style={styles.section}>
          <Text variant="h4" color={colors.secondary.main} style={styles.sectionTitle}>
            App Information
          </Text>
          <View style={styles.infoRow}>
            <Text variant="body2" color={colors.text.secondary}>
              Version:
            </Text>
            <Text variant="body2">1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="body2" color={colors.text.secondary}>
              Environment:
            </Text>
            <Text variant="body2">Development</Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="body2" color={colors.text.secondary}>
              Build:
            </Text>
            <Text variant="body2">{formatShortDate(new Date())}</Text>
          </View>
        </Card>
      </ScrollView>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  debugPanel: {
    width: '90%',
    maxWidth: 800,
    maxHeight: '80%',
    backgroundColor: colors.background.paper,
  },
  content: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
});

export default DebugPanelModal;
