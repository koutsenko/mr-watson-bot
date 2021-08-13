import { jest } from '@jest/globals';

/**
 * Переопределение (мокание) времени в Jest тестах.
 *
 * @param time UTC время формата 2000-01-01T18:30:00.000Z
 */
export const overrideTime = (time: string) => {
  // @ts-ignore
  Date.now = jest.fn(() => new Date(time));
};
