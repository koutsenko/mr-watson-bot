/**
 * Сценарий: мониторинг сна
 * Пользователь: koutsenko
 *
 * Использует:
 * - модуль планировщика задач, документация https://www.npmjs.com/package/node-schedule.
 */
import * as schedule from 'node-schedule';

import { everyMinute } from '../../constants/jobs';
import { IContext, wrapOwner } from '../../modules/bot';
import { IAppState } from '../../types/state';
import { verbose } from '../../util/log';
import {
  handleIdleStateTick,
  handleSleepAnswer,
  handleWaitingForAnswerTick,
  handleWaitingForSleepTick
} from './actions';
import { EScenarioState, localState } from './state';

/**
 * Инициализация периодических задач и обработчиков сообщений пользователя .
 */
export const init = (state: IAppState): void => {
  // Инициализация задачи на опрос состояния сна.
  const job: schedule = schedule.scheduleJob(everyMinute, async () => {
    verbose(`sleep job cycle, current state: ${localState.state}`);
    if (localState.state === EScenarioState.STATE_IDLE) {
      await handleIdleStateTick(state);
    } else if (localState.state === EScenarioState.STATE_WAITING_FOR_SLEEP) {
      await handleWaitingForSleepTick(state);
    } else if (localState.state === EScenarioState.STATE_WAITING_FOR_ANSWER) {
      handleWaitingForAnswerTick();
    }
  });

  // Сохранение ссылки на задачу.
  state.jobs.push(job);

  // Добавление реакции, пока эхо
  state.bot_module.on(
    'message',
    wrapOwner((ctx: IContext) => {
      if (localState.state === EScenarioState.STATE_WAITING_FOR_ANSWER) {
        handleSleepAnswer(ctx);
      }
    })
  );
};
