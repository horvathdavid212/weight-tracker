import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { Text } from './ui';

const LoadingFallback: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text color={colors.text.primary}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.main,
  },
});

export default LoadingFallback;
