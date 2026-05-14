const DEFAULT_WEIGHT_UNIT = 'kg';

function trimTrailingZero(value: string): string {
  return value.endsWith('.0') ? value.slice(0, -2) : value;
}

export function formatWeight(weight: number, fractionDigits = 1): string {
  if (!Number.isFinite(weight)) {
    return '';
  }

  return trimTrailingZero(weight.toFixed(fractionDigits));
}

export function formatWeightWithUnit(
  weight: number,
  unit = DEFAULT_WEIGHT_UNIT
): string {
  const formattedWeight = formatWeight(weight);
  return formattedWeight ? `${formattedWeight} ${unit}` : '';
}
