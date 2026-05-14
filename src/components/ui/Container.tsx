import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';

interface ContainerProps extends ViewProps {
  scrollable?: boolean;
  padded?: boolean;
  safeArea?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

const Container: React.FC<ContainerProps> = ({
  children,
  scrollable = false,
  padded = true,
  safeArea = true,
  style,
  contentContainerStyle,
  ...rest
}) => {
  const containerStyle = {
    ...styles.container,
    ...(padded ? styles.padded : {}),
    ...style,
  };

  const content = scrollable ? (
    <ScrollView
      style={containerStyle}
      contentContainerStyle={{
        ...(padded ? styles.scrollContentPadded : {}),
        ...contentContainerStyle,
      }}
      showsVerticalScrollIndicator={false}
      {...rest}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={containerStyle} {...rest}>
      {children}
    </View>
  );

  if (safeArea) {
    return <SafeAreaView style={styles.safeArea}>{content}</SafeAreaView>;
  }

  return content;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  padded: {
    padding: spacing.md,
  },
  scrollContentPadded: {
    paddingBottom: spacing.xl,
  },
});

export default Container;
