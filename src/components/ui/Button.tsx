import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors, typography, borderRadius, spacing } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  disabled,
  ...rest
}) => {
  // Determine button styles based on variant
  const getButtonStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? colors.tertiary.light : colors.primary.main,
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? colors.tertiary.light : colors.secondary.main,
        };
      case 'tertiary':
        return {
          backgroundColor: disabled ? colors.tertiary.light : colors.tertiary.main,
        };
      case 'outline':
        return {
          backgroundColor: colors.common.transparent,
          borderWidth: 2,
          borderColor: disabled ? colors.tertiary.light : colors.secondary.main,
        };
      default:
        return {};
    }
  };

  // Determine text color based on variant
  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
        return colors.primary.text;
      case 'secondary':
        return colors.secondary.text;
      case 'tertiary':
        return colors.tertiary.text;
      case 'outline':
        return disabled ? colors.text.disabled : colors.secondary.main;
      default:
        return colors.text.primary;
    }
  };

  // Determine button size
  const getButtonSize = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.md,
          borderRadius: borderRadius.sm,
        };
      case 'large':
        return {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          borderRadius: borderRadius.md,
        };
      case 'medium':
      default:
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          borderRadius: borderRadius.sm,
        };
    }
  };

  // Determine text size
  const getTextSize = (): TextStyle => {
    switch (size) {
      case 'small':
        return { fontSize: 14 };
      case 'large':
        return { fontSize: 18 };
      case 'medium':
      default:
        return { fontSize: 16 };
    }
  };

  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        ...getButtonStyles(),
        ...getButtonSize(),
        ...(fullWidth ? styles.fullWidth : {}),
        ...style,
      }}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? colors.secondary.main : getTextColor()}
        />
      ) : (
        <Text
          style={{
            ...styles.text,
            color: getTextColor(),
            ...getTextSize(),
            ...textStyle,
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    ...typography.button,
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button;
