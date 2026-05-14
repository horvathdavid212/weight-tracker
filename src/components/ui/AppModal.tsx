import React from 'react';
import {
  Keyboard,
  Modal,
  ModalProps,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { borderRadius, colors, spacing } from '../../theme';

type AppModalPresentation = 'center' | 'bottom';

interface AppModalProps {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  animationType?: ModalProps['animationType'];
  presentation?: AppModalPresentation;
  dismissOnBackdropPress?: boolean;
  dismissKeyboardOnBackdropPress?: boolean;
  overlayStyle?: StyleProp<ViewStyle>;
  panelStyle?: StyleProp<ViewStyle>;
}

const AppModal: React.FC<AppModalProps> = ({
  visible,
  onRequestClose,
  children,
  animationType = 'fade',
  presentation = 'center',
  dismissOnBackdropPress = true,
  dismissKeyboardOnBackdropPress = false,
  overlayStyle,
  panelStyle,
}) => {
  const handleBackdropPress = () => {
    if (dismissKeyboardOnBackdropPress) {
      Keyboard.dismiss();
    }

    if (dismissOnBackdropPress) {
      onRequestClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
      <View
        style={[
          styles.overlay,
          presentation === 'center' ? styles.centerOverlay : styles.bottomOverlay,
          overlayStyle,
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
        <View
          style={[
            styles.panel,
            presentation === 'center' ? styles.centerPanel : styles.bottomPanel,
            panelStyle,
          ]}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  centerOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  bottomOverlay: {
    justifyContent: 'flex-end',
  },
  panel: {
    width: '100%',
    backgroundColor: colors.background.paper,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  centerPanel: {
    maxWidth: 400,
    borderRadius: borderRadius.md,
  },
  bottomPanel: {
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
  },
});

export default AppModal;
