import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  StyleProp,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  leftIcon,
  rightIcon,
  style,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus: NonNullable<TextInputProps['onFocus']> = (e) => {
    setIsFocused(true);
    if (rest.onFocus) {
      rest.onFocus(e);
    }
  };

  const handleBlur: NonNullable<TextInputProps['onBlur']> = (e) => {
    setIsFocused(false);
    if (rest.onBlur) {
      rest.onBlur(e);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, isFocused && styles.focused, Boolean(error) && styles.error]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            Boolean(leftIcon) && styles.inputWithLeftIcon,
            Boolean(rightIcon) && styles.inputWithRightIcon,
            style,
          ]}
          placeholderTextColor={colors.text.hint}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.tertiary.main,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    height: 48,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.xs,
  },
  inputWithRightIcon: {
    paddingRight: spacing.xs,
  },
  iconLeft: {
    paddingLeft: spacing.md,
  },
  iconRight: {
    paddingRight: spacing.md,
  },
  focused: {
    borderColor: colors.secondary.main,
    borderWidth: 2,
  },
  error: {
    borderColor: colors.status.error,
  },
  errorText: {
    color: colors.status.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});

export default Input;
