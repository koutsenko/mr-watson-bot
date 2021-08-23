import { getReadableTimestamp } from './datetime';

/**
 * Печатает сообщение со штампом времени.
 *
 * @param message
 */
export const log = (message: string): void => {
  console.log(getReadableTimestamp(), message);
};
