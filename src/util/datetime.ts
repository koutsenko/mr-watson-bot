import dateformat from 'dateformat';
import moment from 'moment-timezone';

/**
 * Вычисляет признак позднего вечера.
 */
export const isLateEvening = (): boolean => {
  const hour = moment.tz('Europe/Moscow').hour();
  const result = hour === 23;

  return result;
};

/**
 * Вычисляет признак поздней ночи.
 */
export const isNight = (): boolean => {
  const hour = moment.tz('Europe/Moscow').hour();
  const result = hour >= 0 && hour < 5;

  return result;
};

/**
 * Возвращает штап текущего времени вида dd.mm.yyyy HH:MM:ss.
 */
export const getReadableTimestamp = (): string => {
  const now = new Date();
  const result = dateformat(now, 'dd.mm.yyyy HH:MM:ss');

  return result;
};
