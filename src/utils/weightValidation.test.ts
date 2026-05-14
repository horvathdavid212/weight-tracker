import { describe, expect, it } from '@jest/globals';
import {
  MAX_WEIGHT_KG,
  MIN_WEIGHT_KG,
  parseAndValidateWeightInput,
  parseWeightInput,
  validateWeightValue,
} from './weightValidation';

describe('weightValidation', () => {
  it('parses valid weight input with whitespace and comma decimals', () => {
    expect(parseWeightInput(' 72,5 ')).toBe(72.5);
  });

  it('returns null for empty or invalid weight input', () => {
    expect(parseWeightInput('')).toBeNull();
    expect(parseWeightInput('abc')).toBeNull();
  });

  it('validates numeric ranges and field labels', () => {
    expect(validateWeightValue(Number.NaN, { fieldLabel: 'goal weight' })).toBe(
      'Please enter a valid goal weight.'
    );
    expect(validateWeightValue(MIN_WEIGHT_KG - 1)).toBe(
      `weight must be between ${MIN_WEIGHT_KG} kg and ${MAX_WEIGHT_KG} kg.`
    );
    expect(validateWeightValue(72.5)).toBeNull();
  });

  it('parses and validates weight input in a single step', () => {
    expect(parseAndValidateWeightInput('70.2')).toEqual({
      value: 70.2,
      error: null,
    });
    expect(
      parseAndValidateWeightInput('700', { fieldLabel: 'current weight' })
    ).toEqual({
      value: 700,
      error: `current weight must be between ${MIN_WEIGHT_KG} kg and ${MAX_WEIGHT_KG} kg.`,
    });
  });
});
