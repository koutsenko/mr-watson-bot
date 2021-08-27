import { isVerboseMode } from '../checks/isVerbose';
import { getReadableTimestamp } from './datetime';

/**
 * Печатает сообщение со штампом времени.
 *
 * @param message
 */
export const log = (message: string): void => {
  console.log(getReadableTimestamp(), message);
};

/**
 * Печатает сообщение со штампом времени, если включен verbose-режим.
 */
export const verbose = (message: string): void => {
  isVerboseMode() && log(message);
};
