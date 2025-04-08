import { TextStyle } from 'react-native';
import { colors } from './colors';

/**
 * Typography styles for the application
 */
export const typography: Record<string, TextStyle> = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  h4: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  
  // Body text
  body1: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  
  // Other text styles
  caption: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
};
