import { describe, it, expect } from '@jest/globals';
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
    statusOffline,
} from "../util/spec/constants";
import { overrideTime } from '../util/spec/tools';
import { shouldGoSleep } from "./tooLateOnline";

/**
 * Проверка бизнесовой логики "пора спать".
 */
describe('tooLateOnline', () => {
    // Один раз проверим статус "оффлайн".
    it('Оффлайн', () => {
        overrideTime(time2330);
        expect(shouldGoSleep(statusOffline)).toBe(false);
    });

    // Один раз проверим нецелевой интервал времени.
    it('Онлайн, день', () => {
        overrideTime(time1200);
        expect(shouldGoSleep(statusOnline)).toBe(false);
    });


    // Два целевых интервала времени.
    it('Онлайн, вечер', () => {
        overrideTime(time2330);
        expect(shouldGoSleep(statusOnline)).toBe(true);
    });
    it('Онлайн, ночь', () => {
        overrideTime(time0030);
        expect(shouldGoSleep(statusOnline)).toBe(true);
    });

    // Проверим граничные условия (11 вечера, полночь, 5 утра)
    it('Онлайн, ровно 11 вечера', () => {
        overrideTime(time2300);
        expect(shouldGoSleep(statusOnline)).toBe(true);
    });
    it('Онлайн, ровно полночь', () => {
        overrideTime(time0000);
        expect(shouldGoSleep(statusOnline)).toBe(true);
    });
    it('Онлайн, ровно 5 утра', () => {
        overrideTime(time0500);
        expect(shouldGoSleep(statusOnline)).toBe(false);
    });

    // Проверим околограничные условия (раньше)
    it('Онлайн, чуть меньше 11 вечера', () => {
        overrideTime(time2259);
        expect(shouldGoSleep(statusOnline)).toBe(false);
    });
    it('Онлайн, чуть меньше полуночи', () => {
        overrideTime(time2359);
        expect(shouldGoSleep(statusOnline)).toBe(true);
    });
    it('Онлайн, чуть меньше 5 утра', () => {
        overrideTime(time0459);
        expect(shouldGoSleep(statusOnline)).toBe(true);
    });

    // Проверим околограничные условия (позже)
    it('Онлайн, чуть больше 11 вечера', () => {
        overrideTime(time2301);
        expect(shouldGoSleep(statusOnline)).toBe(true);
    });
    it('Онлайн, чуть больше полуночи', () => {
        overrideTime(time0001);
        expect(shouldGoSleep(statusOnline)).toBe(true);
    });
    it('Онлайн, чуть больше 5 утра', () => {
        overrideTime(time0501);
        expect(shouldGoSleep(statusOnline)).toBe(false);
    });
});
