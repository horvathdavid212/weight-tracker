import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text } from './ui';
import { borderRadius, colors, spacing } from '../theme';
import {
  WeightEntryListItemViewModel,
  WeightTrend,
} from '../utils/weightEntryViewModel';

interface WeightEntryListItemProps {
  item: WeightEntryListItemViewModel;
  onPress: () => void;
  onLongPress: () => void;
}

function getTrendColor(trend: WeightTrend): string {
  if (trend === 'loss') {
    return colors.status.success;
  }

  if (trend === 'gain') {
    return colors.status.error;
  }

  return colors.text.secondary;
}

function getTrendIconName(
  trend: WeightTrend
): React.ComponentProps<typeof Ionicons>['name'] | null {
  if (trend === 'loss') {
    return 'arrow-down';
  }

  if (trend === 'gain') {
    return 'arrow-up';
  }

  if (trend === 'same') {
    return 'remove';
  }

  return null;
}

const WeightEntryListItem: React.FC<WeightEntryListItemProps> = ({
  item,
  onPress,
  onLongPress,
}) => {
  const trendIconName = getTrendIconName(item.trend);

  return (
    <Card variant="elevated" style={styles.entryCard}>
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.7}
      >
        <View style={styles.entryContent}>
          <Text variant="body1" style={styles.entryDate}>
            {item.displayDate}
          </Text>

          <View style={styles.weightContainer}>
            <View style={styles.weightValue}>
              <Text
                variant="h3"
                color={colors.secondary.main}
                style={styles.entryWeight}
              >
                {item.displayWeight}
              </Text>
              <Text variant="body2" style={styles.unitText}>
                kg
              </Text>
            </View>

            {trendIconName ? (
              <View
                style={[
                  styles.trendBadge,
                  { backgroundColor: getTrendColor(item.trend) },
                ]}
              >
                <Ionicons
                  name={trendIconName}
                  size={14}
                  color={colors.common.white}
                />
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  entryCard: {
    marginBottom: spacing.sm,
    padding: 0,
    overflow: 'hidden',
    backgroundColor: colors.background.paper,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary.main,
  },
  entryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  entryDate: {
    color: colors.text.secondary,
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  entryWeight: {
    marginRight: spacing.xs,
    marginBottom: 0,
    lineHeight: 24,
  },
  unitText: {
    color: colors.text.secondary,
    marginRight: spacing.sm,
    marginBottom: 0,
  },
  trendBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginLeft: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 28,
  },
});

export default WeightEntryListItem;
