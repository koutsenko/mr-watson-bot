import { IScenarioState } from '../../../types/scenarios/sleep';
import { verbose } from '../../../util/log';
import { EScenarioState } from '../constants/enums';

/**
 * Мутируемое локальное состояние сценария.
 */
export const scenarioState: IScenarioState = {
  state: EScenarioState.STATE_IDLE,
  data: {}
};

/**
 * Сеттер состояния.
 *
 * @param nextState Следующее значение состояния.
 * @param [nextStateData] Сопутствующие данные.
 */
export const setScenarioState = (nextState: EScenarioState, nextStateData = {}): void => {
  const prevStateValue = scenarioState.state;
  const nextStateValue = nextState;
  verbose(`prev: ${prevStateValue}, next: ${nextStateValue}`);

  scenarioState.state = nextState;
  scenarioState.data = nextStateData;
};
