import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme';
import { Text } from './ui';

interface ErrorFallbackProps {
  error: Error;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  return (
    <View style={styles.container}>
      <Text variant="h3" color={colors.status.error} style={styles.title}>
        Something went wrong!
      </Text>
      <Text color={colors.text.primary} align="center" style={styles.message}>
        {error.message}
      </Text>
      <Text variant="caption" color={colors.text.secondary}>
        Please restart the app or contact support.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background.main,
  },
  title: {
    marginBottom: spacing.sm,
  },
  message: {
    marginBottom: spacing.md,
  },
});

export default ErrorFallback;
