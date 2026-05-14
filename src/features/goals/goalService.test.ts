import { afterEach, describe, expect, it, jest } from '@jest/globals';
import {
  calculateGoalDate,
  clearGoalData,
  createGoalData,
  getGoalData,
  saveGoalData,
  validateGoalInput,
} from './goalService';

describe('goalService', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('validates goal input fields and business rules', () => {
    expect(
      validateGoalInput({
        currentWeight: 10,
        goalWeight: 8,
        weightLossRate: 0.5,
      })
    ).toBe('current weight must be between 20 kg and 500 kg.');

    expect(
      validateGoalInput({
        currentWeight: 80,
        goalWeight: 81,
        weightLossRate: 0.5,
      })
    ).toBe('Goal weight should be less than current weight');

    expect(
      validateGoalInput({
        currentWeight: 80,
        goalWeight: 75,
        weightLossRate: 0,
      })
    ).toBe('Please select a valid weight loss rate.');
  });

  it('calculates the goal date from weight difference and loss rate', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 4, 10, 9, 0, 0));

    const result = calculateGoalDate({
      currentWeight: 80,
      goalWeight: 75,
      weightLossRate: 0.5,
    });

    expect(result.toISOString()).toBe(
      new Date(2026, 6, 19, 9, 0, 0).toISOString()
    );
  });

  it('creates goal data with a computed ISO goal date', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 4, 10, 9, 0, 0));

    expect(
      createGoalData({
        currentWeight: 82,
        goalWeight: 77,
        weightLossRate: 1,
      })
    ).toEqual({
      currentWeight: 82,
      goalWeight: 77,
      weightLossRate: 1,
      goalDate: new Date(2026, 5, 14, 9, 0, 0).toISOString(),
    });
  });

  it('persists, loads, and clears goal data', async () => {
    const goalData = {
      currentWeight: 81,
      goalWeight: 74,
      weightLossRate: 0.7,
      goalDate: new Date(2026, 8, 1, 12, 0, 0).toISOString(),
    };

    await saveGoalData(goalData);
    await expect(getGoalData()).resolves.toEqual(goalData);

    await clearGoalData();
    await expect(getGoalData()).resolves.toBeNull();
  });
});
