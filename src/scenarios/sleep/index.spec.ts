import { describe, expect, it, test } from '@jest/globals';

import { initBotModule } from '../../modules/bot';
import { appState, setInitialGlobalState } from '../../state';
import {
  handleIdleStateTick,
  handleSleepAnswer,
  handleWaitingForAnswerTick,
  handleWaitingForSleepTick
} from './actions';
import { EScenarioState } from './constants/enums';
import { scenarioState, setInitialScenarioState, setScenarioState } from './state';

/**
 * Проверка реагирования бота, если поместить его в имитационную среду.
 */
describe('bot_handlers', () => {
  // Обнуляем состояние приложения и сценария
  setInitialGlobalState();
  setInitialScenarioState();

  // Мокаем интерфейс бота - событийную и сетевую часть.
  // Это вместо вызова initBotModule.
  appState.bot_module = {
    on: (eventType: string) => {
      console.log(`Event "${eventType}" listener installed`);
    },
    telegram: {
      sendMessage: (id: string, message: string) => {
        console.log('Sending message', message, 'to id', id);
      }
    }
  };

  it('Initial state is ', () => {
    expect(scenarioState.state).toBe(EScenarioState.STATE_IDLE);
  });

  //
});
