/**
 * Модуль планировщика задач, задействует библиотеку node-schedule.
 * Библиотечная документация - https://www.npmjs.com/package/node-schedule.
 */
import * as MTProto from '@mtproto/core';
import * as schedule from 'node-schedule';
import { Telegraf } from 'telegraf';

import { shouldGoSleep } from '../checks/tooLateOnline';
import { everyMinute } from '../constants/jobs';
import { IUser } from '../types/telegram-api';

/**
 * Задача проверки качества сна патрона.
 *
 * @param mBot Инстанс модуля бота, который дает обратную связь.
 * @param mHuman Инстанс модуля человека, который смотрит за происходящим.
 * @param human_access_hash Хэш доступа к метаданным учетной записи.
 */
export const initSleepJob = (
  mHuman: MTProto,
  mBot: Telegraf,
  human_access_hash: string
): any => {
  const job = schedule.scheduleJob(everyMinute, async () => {
    const id = process.env.OWNER_CHAT_ID;
    const result: IUser = await mHuman.getUser(id, human_access_hash);
    const { status } = result.user;
    if (shouldGoSleep(status)) {
      mBot.telegram.sendMessage(id, 'Пора спать!');
    }
  });

  return job;
};
