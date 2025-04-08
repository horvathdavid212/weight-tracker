import React from 'react';
import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { typography } from '../../theme';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'button'
  | 'label';

interface CustomTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  style?: TextStyle;
}

const Text: React.FC<CustomTextProps> = ({
  children,
  variant = 'body1',
  color,
  align,
  style,
  ...rest
}) => {
  return (
    <RNText
      style={{
        ...typography[variant],
        ...(color ? { color } : {}),
        ...(align ? { textAlign: align } : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </RNText>
  );
};

export default Text;
