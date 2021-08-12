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
} from "./spec/constants";
import { overrideTime } from '../util/spec/tools';
import { isLateEvening, isNight } from "./datetime";

const isLateEveningResults = [
    [time0000, false], 
    [time0001, false],
    [time0030, false],
    [time0459, false],
    [time0500, false],
    [time0501, false],
    [time1200, false],
    [time2259, false],
    [time2300, true],
    [time2301, true],
    [time2330, true],
    [time2359, true],
];

const isNightResults = [
    [time0000, true], 
    [time0001, true],
    [time0030, true],
    [time0459, true],
    [time0500, false],
    [time0501, false],
    [time1200, false],
    [time2259, false],
    [time2300, false],
    [time2301, false],
    [time2330, false],
    [time2359, false],
];

/**
 * Проверка функций, определяющих поздний вечер и ночь.
 */
describe('datetime', () => {
    // Функция isLateEvening 
    it('isLateEvening', () => {
        test.each(isLateEveningResults, (time, result) => {
            overrideTime(time);
            expect(isLateEvening()).toBe(result);
        });
    });

    // Функция isNight
    it('isNight', () => {
        test.each(isNightResults, (time, result) => {
            overrideTime(time);
            expect(isNight()).toBe(result);
        });
    });
});
