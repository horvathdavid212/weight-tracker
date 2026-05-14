import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './Text';
import { borderRadius, colors, spacing } from '../../theme';

type ModalHeaderTitleAlign = 'left' | 'center';

interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  rightContent?: React.ReactNode;
  titleAlign?: ModalHeaderTitleAlign;
  showDivider?: boolean;
  style?: StyleProp<ViewStyle>;
}

const SLOT_WIDTH = 40;

const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  subtitle,
  onClose,
  rightContent,
  titleAlign = 'left',
  showDivider = false,
  style,
}) => {
  const actionContent =
    rightContent ??
    (onClose ? (
      <TouchableOpacity
        onPress={onClose}
        style={styles.closeButton}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={20} color={colors.text.primary} />
      </TouchableOpacity>
    ) : null);

  return (
    <View
      style={[
        styles.container,
        showDivider && styles.divider,
        style,
      ]}
    >
      {titleAlign === 'center' ? <View style={styles.sideSlot} /> : null}

      <View style={styles.titleContainer}>
        <Text
          variant="h3"
          color={colors.secondary.main}
          align={titleAlign}
          style={subtitle ? styles.titleWithSubtitle : styles.title}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            variant="caption"
            color={colors.text.secondary}
            align={titleAlign}
            style={styles.subtitle}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {actionContent ? (
        <View style={styles.sideSlot}>{actionContent}</View>
      ) : titleAlign === 'center' ? (
        <View style={styles.sideSlot} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.tertiary.main,
  },
  titleContainer: {
    flex: 1,
  },
  sideSlot: {
    width: SLOT_WIDTH,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.round,
    backgroundColor: colors.tertiary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 0,
  },
  titleWithSubtitle: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: 0,
  },
});

export default ModalHeader;
