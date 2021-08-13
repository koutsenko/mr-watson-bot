/**
 * Константы для тестовых сценариев.
 */

import { IUserStatus } from '../../types/telegram-api';

// Граничные значения
export const time2300 = '2000-01-01T23:00:00.000+03:00';
export const time0000 = '2000-01-01T00:00:00.000+03:00';
export const time0500 = '2000-01-01T05:00:00.000+03:00';

// Околограничные значения (раньше)
export const time2259 = '2000-01-01T22:59:00.000+03:00';
export const time2359 = '2000-01-01T23:59:00.000+03:00';
export const time0459 = '2000-01-01T04:59:00.000+03:00';

// Околограничные значения (позже)
export const time2301 = '2000-01-01T23:01:00.000+03:00';
export const time0001 = '2000-01-01T00:01:00.000+03:00';
export const time0501 = '2000-01-01T05:01:00.000+03:00';

// Нецелевой интервал
export const time1200 = '2000-01-01T12:00:00.000+03:00';

// Целевые интервалы (вечером и ночью)
export const time2330 = '2000-01-01T23:30:00.000+03:00';
export const time0030 = '2000-01-01T00:30:00.000+03:00';

// Статусы
export const statusOnline: IUserStatus = { _: 'userStatusOnline' };
export const statusOffline: IUserStatus = { _: 'userStatusOffline' };
