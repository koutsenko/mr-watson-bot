import { IUserStatus } from "../types/telegram-api";
import { isLateEvening, isNight } from "../util/datetime";

/**
 * Проверка на то, что патрону пора спать.
 */
export const shouldGoSleep = (status: IUserStatus) => {
    const online = status._ === 'userStatusOnline';
    const lateEvening = isLateEvening();
    const night = isNight();

    return online && (lateEvening || night);
};
