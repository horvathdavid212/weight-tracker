export const MIN_WEIGHT_KG = 20;
export const MAX_WEIGHT_KG = 500;

interface WeightValidationOptions {
  fieldLabel?: string;
  min?: number;
  max?: number;
}

interface ParsedWeightInputResult {
  value: number | null;
  error: string | null;
}

function normalizeWeightInput(input: string): string {
  return input.trim().replace(',', '.');
}

export function parseWeightInput(input: string): number | null {
  const normalizedInput = normalizeWeightInput(input);
  if (!normalizedInput) {
    return null;
  }

  const parsedValue = Number(normalizedInput);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function validateWeightValue(
  value: number,
  options: WeightValidationOptions = {}
): string | null {
  const {
    fieldLabel = 'weight',
    min = MIN_WEIGHT_KG,
    max = MAX_WEIGHT_KG,
  } = options;

  if (!Number.isFinite(value)) {
    return `Please enter a valid ${fieldLabel}.`;
  }

  if (value < min || value > max) {
    return `${fieldLabel} must be between ${min} kg and ${max} kg.`;
  }

  return null;
}

export function parseAndValidateWeightInput(
  input: string,
  options: WeightValidationOptions = {}
): ParsedWeightInputResult {
  const parsedValue = parseWeightInput(input);
  if (parsedValue === null) {
    return {
      value: null,
      error: `Please enter a valid ${options.fieldLabel ?? 'weight'}.`,
    };
  }

  return {
    value: parsedValue,
    error: validateWeightValue(parsedValue, options),
  };
}
