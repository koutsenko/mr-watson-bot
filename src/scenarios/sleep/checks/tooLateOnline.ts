import { IUserStatus } from '../../../types/telegram-api';
import { isLateEvening, isNight } from '../../../util/datetime';

/**
 * Проверка на необходимость взглянуть, спит патрон или нет.
 */
export const shouldCheckStatus = (): boolean => {
  const lateEvening = isLateEvening();
  const night = isNight();

  return lateEvening || night;
};

/**
 * Проверка на то, что патрону пора спать.
 */
export const shouldGoSleep = (status: IUserStatus): boolean => {
  const online = status._ === 'userStatusOnline';
  const lateEvening = isLateEvening();
  const night = isNight();

  return online && (lateEvening || night);
};
