import { verbose } from '../../../util/log';

/**
 * Варианты значений локального состояния.
 *
 * @property STATE_QUERYING Выполняется запрос и обработка реакции.
 * @property STATE_WAITING_FOR_SLEEP Ожидание, ушел ли спать после напоминания.
 * @property STATE_WAITING_FOR_ANSWER Ожидается ответ "почему не спишь".
 * @property STATE_IDLE Модуль бездействует.
 */
export enum EScenarioState {
  STATE_QUERYING,
  STATE_WAITING_FOR_SLEEP,
  STATE_WAITING_FOR_ANSWER,
  STATE_IDLE
}

/**
 * Локальное состояние сценария сна.
 *
 * @property state Состояние.
 * @property data Данные состояния.
 * @property data.ticks Счетчик минут после 1-го напоминания.
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
export const setState = (nextState: EScenarioState, nextStateData = {}): void => {
  const prevStateValue = EScenarioState[localState.state];
  const nextStateValue = EScenarioState[nextState];
  verbose(`prev: ${prevStateValue}, next: ${nextStateValue}`);

  localState.state = nextState;
  localState.data = nextStateData;
};

/**
 * Мутируемое локальное состояние сценария.
 */
export const localState: IScenarioState = {
  state: EScenarioState.STATE_IDLE,
  data: {}
};
