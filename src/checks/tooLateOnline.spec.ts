import { describe, it, expect, test } from '@jest/globals';
import {
  time0000,
  time0001,
  time0030,
  time0459,
  time0500,
  time0501,
  time1200,
  time2259,
  time2300,
  time2301,
  time2330,
  time2359,
  statusOnline,
  statusOffline
} from '../util/spec/constants';
import { overrideTime } from '../util/spec/tools';
import { shouldGoSleep } from './tooLateOnline';

const shouldGoSleepResults = [
  [time2330, statusOffline, false], // Один раз проверим статус "оффлайн"
  [time1200, statusOnline, false], // Один раз проверим нецелевой интервал времени.
  [time2300, statusOnline, true], // Целевой интервал времени - онлайн, вечер
  [time0030, statusOnline, true], // Целевой интервал времени - онлайн, ночь
  [time2300, statusOnline, true], // Граничное условие - 11 вечера
  [time0000, statusOnline, true], // Граничное условие - полночь
  [time0500, statusOnline, false], // Граничное условие - 5 утра
  [time2259, statusOnline, false], // Околограничное условие - чуть раньше 11 вечера
  [time2359, statusOnline, true], // Околограничное условие - чуть раньше полуночи
  [time0459, statusOnline, true], // Околограничное условие - чуть раньше 5 утра
  [time2301, statusOnline, true], // Околограничное условие - чуть позже 11 вечера
  [time0001, statusOnline, true], // Околограничное условие - чуть позже полуночи
  [time0501, statusOnline, false] // Околограничное условие - чуть позже 5 утра
];

/**
 * Проверка бизнесовой логики "пора спать".
 */
describe('tooLateOnline', () => {
  // Функция shouldGoSleep
  it('shouldGoSleep', () => {
    test.each(shouldGoSleepResults, (time, status, result) => {
      overrideTime(time);
      expect(shouldGoSleep(status)).toBe(result);
    });
  });
});
