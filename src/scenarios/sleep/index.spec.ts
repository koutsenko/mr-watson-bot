import { describe, expect, it, test } from '@jest/globals';

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
  setInitialScenarioState();

  it('Initial state is ', () => {
    expect(scenarioState.state).toBe(EScenarioState.STATE_IDLE);
  });
});
