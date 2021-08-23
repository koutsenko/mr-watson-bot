/**
 * Модуль планировщика задач, задействует библиотеку node-schedule.
 * Библиотечная документация - https://www.npmjs.com/package/node-schedule.
 */
import * as schedule from 'node-schedule';

import { shouldGoSleep } from '../../../checks/tooLateOnline';
import { everyMinute } from '../../../constants/jobs';
import { IAppState } from '../../../types/state';
import { IUser } from '../../../types/telegram-api';
import { log } from '../../../util/log';

/**
 * Задача проверки качества сна патрона.
 *
 * @param state состояние приложения.
 */
export const initSleepJob = (state: IAppState): schedule => {
  const { debug, human_module, bot_module, human_access_hash } = state;
  const job: schedule = schedule.scheduleJob(everyMinute, async () => {
    debug && log('sleep job cycle');
    const id = process.env.OWNER_CHAT_ID;
    const result: IUser = await human_module.getUser(id, human_access_hash);
    const { status } = result.user;
    if (shouldGoSleep(status)) {
      bot_module.telegram.sendMessage(id, 'Пора спать!');
    }
  });

  return job;
};
