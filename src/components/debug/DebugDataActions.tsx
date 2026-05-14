import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from '../ui';
import { colors, spacing } from '../../theme';

interface DebugDataActionsProps {
  onAddSampleData: () => void;
  onGenerateYearData: () => void;
  onClearWeightData: () => void;
  onViewStorage: () => void;
  onClearAllStorage: () => void;
}

const DebugDataActions: React.FC<DebugDataActionsProps> = ({
  onAddSampleData,
  onGenerateYearData,
  onClearWeightData,
  onViewStorage,
  onClearAllStorage,
}) => {
  return (
    <>
      <Card variant="outlined" style={styles.section}>
        <Text variant="h4" color={colors.secondary.main} style={styles.sectionTitle}>
          Data Management
        </Text>
        <View style={styles.buttonGroup}>
          <Button
            title="Add Sample Data"
            onPress={onAddSampleData}
            variant="secondary"
            size="small"
            style={styles.button}
          />
          <Button
            title="Generate Year Data"
            onPress={onGenerateYearData}
            variant="secondary"
            size="small"
            style={styles.button}
          />
          <Button
            title="Clear Weight Data"
            onPress={onClearWeightData}
            variant="tertiary"
            size="small"
            style={styles.button}
          />
        </View>
      </Card>

      <Card variant="outlined" style={styles.section}>
        <Text variant="h4" color={colors.secondary.main} style={styles.sectionTitle}>
          Storage Management
        </Text>
        <View style={styles.buttonGroup}>
          <Button
            title="View Storage"
            onPress={onViewStorage}
            variant="secondary"
            size="small"
            style={styles.button}
          />
          <Button
            title="Clear All Storage"
            onPress={onClearAllStorage}
            variant="tertiary"
            size="small"
            style={styles.button}
          />
        </View>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    marginBottom: spacing.sm,
    width: '48%',
  },
});

export default DebugDataActions;
