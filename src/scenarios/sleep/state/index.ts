import { verbose } from '../../../util/log';

/**
 * Варианты значений локального состояния.
 *
 * @property STATE_WAITING_FOR_SLEEP Ожидание, ушел ли спать после напоминания.
 * @property STATE_WAITING_FOR_ANSWER Ожидается ответ "почему не спишь".
 * @property STATE_IDLE Модуль бездействует.
 */
export enum EScenarioState {
  STATE_WAITING_FOR_SLEEP = 'STATE_WAITING_FOR_SLEEP',
  STATE_WAITING_FOR_ANSWER = 'STATE_WAITING_FOR_ANSWER',
  STATE_IDLE = 'STATE_IDLE'
}

/**
 * Мутируемое локальное состояние сценария.
 */
export const scenarioState: IScenarioState = {
  state: EScenarioState.STATE_IDLE,
  data: {}
};

/**
 * Локальное состояние сценария сна.
 *
 * @property state Состояние.
 * @property data Данные состояния.
 * @property data.ticks Счетчик активности состояния.
 */
export interface IScenarioState {
  state: EScenarioState;
  data: {
    ticks?: number;
  };
}

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
