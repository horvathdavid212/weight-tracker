import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';

interface HeaderIconProps {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  size?: number;
  color?: string;
  onPress: () => void;
  style?: ViewStyle;
}

const HeaderIcon: React.FC<HeaderIconProps> = ({
  iconName,
  size = 24,
  color = colors.text.primary,
  onPress,
  style
}) => {
  return (
    <TouchableOpacity
      style={{...styles.container, ...style}}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name={iconName} size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
});

export default HeaderIcon;
