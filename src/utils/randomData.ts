/**
 * Utility functions for generating random seed data
 */

/**
 * Generate random year between min and max (inclusive)
 */
export const randomYear = (min: number = 2015, max: number = 2024): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate random price between min and max
 */
export const randomPrice = (min: number = 150000, max: number = 800000): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Get random element from array
 */
export const randomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Generate random kilometer between min and max
 */
export const randomKilometers = (min: number = 10000, max: number = 150000): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

