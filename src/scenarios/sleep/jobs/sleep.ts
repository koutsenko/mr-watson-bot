/**
 * Модуль планировщика задач, задействует библиотеку node-schedule.
 * Библиотечная документация - https://www.npmjs.com/package/node-schedule.
 */
import * as schedule from 'node-schedule';

import { everyMinute } from '../../../constants/jobs';
import { IAppState } from '../../../types/state';
import { IUser } from '../../../types/telegram-api';
import { log, verbose } from '../../../util/log';
import { shouldCheckStatus, shouldGoSleep } from '../checks/tooLateOnline';
import { EScenarioState, IScenarioState, setState } from '../state';

/**
 * Задача проверки качества сна патрона.
 *
 * @param state состояние приложения.
 */
export const initSleepJob = (state: IAppState, localState: IScenarioState): schedule => {
  const { human_module, bot_module, human_access_hash } = state;
  const job: schedule = schedule.scheduleJob(everyMinute, async () => {
    verbose(`sleep job cycle, current state: ${localState.state}`);
    const id = process.env.OWNER_CHAT_ID;
    switch (localState.state) {
      case EScenarioState.STATE_IDLE: {
        // Если неактуально, идлим дальше
        if (!shouldCheckStatus()) {
          break;
        }

        const result: IUser = await human_module.getUser(id, human_access_hash);
        const { status } = result.user;
        if (shouldGoSleep(status)) {
          bot_module.telegram.sendMessage(id, 'Пора спать!');
          setState(EScenarioState.STATE_WAITING_FOR_SLEEP, { ticks: 0 });
        } else {
          setState(EScenarioState.STATE_IDLE);
        }
        break;
      }
      case EScenarioState.STATE_WAITING_FOR_SLEEP: {
        // Если уже неактуально, переводим сценарий в режим идла.
        if (!shouldCheckStatus()) {
          setState(EScenarioState.STATE_IDLE);
          break;
        }

        // Если 5 минут не прошло, продолжаем ждать, используя ежеминутную джобу сценария.
        const ticks = localState.data.ticks + 1;
        if (ticks < 5) {
          setState(EScenarioState.STATE_WAITING_FOR_SLEEP, { ticks });
          break;
        }

        const result: IUser = await human_module.getUser(id, human_access_hash);
        const { status } = result.user;
        if (shouldGoSleep(status)) {
          bot_module.telegram.sendMessage(id, 'Почему ты не спишь? Жду ответа');
          setState(EScenarioState.STATE_WAITING_FOR_ANSWER);
        } else {
          setState(EScenarioState.STATE_IDLE);
        }

        break;
      }
      case EScenarioState.STATE_WAITING_FOR_ANSWER: {
        log('not implemented');
        break;
      }
    }
  });

  return job;
};
