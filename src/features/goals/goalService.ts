import { WeightEntry } from '../../types/WeightEntry';
import { asyncStorageClient } from '../../storage/asyncStorageClient';
import { STORAGE_KEYS } from '../../storage/storageKeys';
import { validateWeightValue } from '../../utils/weightValidation';
import { GoalData, GoalInput } from './types';

export const DEFAULT_WEIGHT_LOSS_RATE = 0.5;

export async function getGoalData(): Promise<GoalData | null> {
  return asyncStorageClient.getJson<GoalData>(STORAGE_KEYS.goalData);
}

export async function saveGoalData(goalData: GoalData): Promise<GoalData> {
  await asyncStorageClient.setJson(STORAGE_KEYS.goalData, goalData);
  return goalData;
}

export async function clearGoalData(): Promise<void> {
  await asyncStorageClient.removeItem(STORAGE_KEYS.goalData);
}

export function validateGoalInput(input: GoalInput): string | null {
  const currentWeightError = validateWeightValue(input.currentWeight, {
    fieldLabel: 'current weight',
  });
  if (currentWeightError) {
    return currentWeightError;
  }

  const goalWeightError = validateWeightValue(input.goalWeight, {
    fieldLabel: 'goal weight',
  });
  if (goalWeightError) {
    return goalWeightError;
  }

  if (Number.isNaN(input.weightLossRate) || input.weightLossRate <= 0) {
    return 'Please select a valid weight loss rate.';
  }

  if (input.goalWeight >= input.currentWeight) {
    return 'Goal weight should be less than current weight';
  }

  return null;
}

export function calculateGoalDate(input: GoalInput): Date {
  const weightDifference = Math.abs(input.currentWeight - input.goalWeight);
  const weeksNeeded = weightDifference / input.weightLossRate;
  const goalDate = new Date();
  goalDate.setDate(goalDate.getDate() + weeksNeeded * 7);
  return goalDate;
}

export function createGoalData(input: GoalInput): GoalData {
  return {
    currentWeight: input.currentWeight,
    goalWeight: input.goalWeight,
    weightLossRate: input.weightLossRate,
    goalDate: calculateGoalDate(input).toISOString(),
  };
}

export function buildGoalLine(
  chartEntries: WeightEntry[],
  goalData: GoalData
): number[] {
  if (chartEntries.length < 2) {
    return [];
  }

  const startDate = new Date(chartEntries[0].date);
  const endDate = new Date(goalData.goalDate);
  const totalDuration = endDate.getTime() - startDate.getTime();

  if (Number.isNaN(totalDuration) || totalDuration <= 0) {
    return [];
  }

  return chartEntries.map((entry) => {
    const pointDate = new Date(entry.date);
    const progress = Math.min(
      Math.max((pointDate.getTime() - startDate.getTime()) / totalDuration, 0),
      1
    );

    return (
      goalData.currentWeight +
      (goalData.goalWeight - goalData.currentWeight) * progress
    );
  });
}
