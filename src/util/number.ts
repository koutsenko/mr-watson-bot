/**
 * Генерация числа в диапазоне от min до max.
 */
export const randomNumber = (min: number, max: number): number => {
  const result = Math.random() * (max - min) + min;

  return result;
};

/**
 * Генерация целого числа в диапазоне от min до max.
 */
export const randomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);

  const result = Math.floor(Math.random() * (max - min + 1)) + min;

  return result;
};
