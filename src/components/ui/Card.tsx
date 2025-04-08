import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing } from '../../theme';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  style,
  ...rest
}) => {
  const getCardStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          ...styles.card,
          ...styles.elevated,
        };
      case 'outlined':
        return {
          ...styles.card,
          ...styles.outlined,
        };
      case 'default':
      default:
        return styles.card;
    }
  };

  return (
    <View style={{...getCardStyle(), ...style}} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  elevated: {
    elevation: 4,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.tertiary.main,
    backgroundColor: colors.background.main,
  },
});

export default Card;
