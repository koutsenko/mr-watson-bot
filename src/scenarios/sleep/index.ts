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
import { appState } from '../../state';
import { verbose } from '../../util/log';
import {
  handleIdleStateTick,
  handleSleepAnswer,
  handleWaitingForAnswerTick,
  handleWaitingForSleepTick
} from './actions';
import { EScenarioState, scenarioState } from './state';

/**
 * Инициализация периодических задач и обработчиков сообщений пользователя.
 */
export const init = (): void => {
  // Инициализация задачи на опрос состояния сна.
  const job: schedule = schedule.scheduleJob(everyMinute, async () => {
    verbose(`sleep job cycle, current state: ${scenarioState.state}`);
    if (scenarioState.state === EScenarioState.STATE_IDLE) {
      await handleIdleStateTick();
    } else if (scenarioState.state === EScenarioState.STATE_WAITING_FOR_SLEEP) {
      await handleWaitingForSleepTick();
    } else if (scenarioState.state === EScenarioState.STATE_WAITING_FOR_ANSWER) {
      handleWaitingForAnswerTick();
    }
  });

  // Сохранение ссылки на задачу.
  appState.jobs.push(job);

  // Добавление реакции, пока эхо
  appState.bot_module.on(
    'message',
    wrapOwner((ctx: IContext) => {
      if (scenarioState.state === EScenarioState.STATE_WAITING_FOR_ANSWER) {
        handleSleepAnswer(ctx);
      }
    })
  );
};
