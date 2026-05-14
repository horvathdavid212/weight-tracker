import React from 'react';
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

type FormActionsDirection = 'vertical' | 'horizontal';

interface FormActionsProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode;
  direction?: FormActionsDirection;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}

const FormActions: React.FC<FormActionsProps> = ({
  children,
  direction = 'vertical',
  gap = 8,
  style,
  ...rest
}) => {
  const childArray = React.Children.toArray(children).filter(Boolean);

  return (
    <View
      style={[
        styles.container,
        direction === 'horizontal' ? styles.horizontal : styles.vertical,
        style,
      ]}
      {...rest}
    >
      {childArray.map((child, index) => {
        const isLast = index === childArray.length - 1;

        return (
          <View
            key={index}
            style={[
              direction === 'horizontal' ? styles.horizontalItem : styles.verticalItem,
              !isLast &&
                (direction === 'horizontal'
                  ? { marginRight: gap }
                  : { marginBottom: gap }),
            ]}
          >
            {child}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  vertical: {
    flexDirection: 'column',
  },
  horizontal: {
    flexDirection: 'row',
  },
  verticalItem: {
    width: '100%',
  },
  horizontalItem: {
    flex: 1,
  },
});

export default FormActions;
