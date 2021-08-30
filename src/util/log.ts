import chalk from 'chalk';

import { isVerboseMode } from '../checks/isVerbose';
import { getReadableTimestamp } from './datetime';
import { randomInt } from './number';

/**
 * Печатает сообщение со цветным штампом времени. Цвет генерируется 1 раз.
 */
export const log = (() => {
  const index = randomInt(0, 5).toString();
  const color = {
    0: chalk.red,
    1: chalk.green,
    2: chalk.yellow,
    3: chalk.blue,
    4: chalk.magenta,
    5: chalk.cyan
  }[index];

  return (message) => console.log(color(getReadableTimestamp()), message);
})();

/**
 * Печатает сообщение со штампом времени, если включен verbose-режим.
 */
export const verbose = (message: string): void => {
  isVerboseMode() && log(message);
};
