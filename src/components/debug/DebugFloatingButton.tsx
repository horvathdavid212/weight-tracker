import React from 'react';
import { StyleSheet, Text as RNText, TouchableOpacity } from 'react-native';
import { colors } from '../../theme';

interface DebugFloatingButtonProps {
  onPress: () => void;
}

const DebugFloatingButton: React.FC<DebugFloatingButtonProps> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <RNText style={styles.floatingButtonText}>D</RNText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: colors.tertiary.main,
  },
  floatingButtonText: {
    color: colors.secondary.main,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DebugFloatingButton;
