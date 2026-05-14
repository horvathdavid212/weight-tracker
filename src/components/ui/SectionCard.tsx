import React from 'react';
import { View, ViewProps, ViewStyle, StyleSheet } from 'react-native';
import Card from './Card';
import Text from './Text';
import { colors, spacing } from '../../theme';

type SectionCardAccent = 'top' | 'left' | 'none';
type SectionCardVariant = 'default' | 'elevated' | 'outlined';

interface SectionCardProps extends Omit<ViewProps, 'style'> {
  title: string;
  subtitle?: string;
  accent?: SectionCardAccent;
  variant?: SectionCardVariant;
  headerRight?: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

function getAccentStyle(accent: SectionCardAccent): ViewStyle {
  if (accent === 'left') {
    return {
      borderLeftWidth: 4,
      borderLeftColor: colors.secondary.main,
    };
  }

  if (accent === 'top') {
    return {
      borderTopWidth: 4,
      borderTopColor: colors.secondary.main,
    };
  }

  return {};
}

const SectionCard: React.FC<SectionCardProps> = ({
  children,
  title,
  subtitle,
  accent = 'top',
  variant = 'elevated',
  headerRight,
  style,
  contentStyle,
  ...rest
}) => {
  return (
    <Card
      variant={variant}
      style={{
        ...styles.card,
        ...getAccentStyle(accent),
        ...style,
      }}
      {...rest}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text
            variant="h3"
            color={colors.secondary.main}
            style={subtitle ? styles.titleWithSubtitle : styles.title}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text variant="caption" color={colors.text.secondary} style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {headerRight ? <View style={styles.headerRight}>{headerRight}</View> : null}
      </View>

      <View style={contentStyle}>{children}</View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
    backgroundColor: colors.background.paper,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: spacing.md,
    paddingBottom: 0,
  },
  headerContent: {
    flex: 1,
  },
  headerRight: {
    marginLeft: spacing.md,
  },
  title: {
    marginBottom: spacing.md,
  },
  titleWithSubtitle: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.md,
  },
});

export default SectionCard;
