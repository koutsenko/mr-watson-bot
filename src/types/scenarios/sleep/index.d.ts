import { EScenarioState } from '../../../scenarios/sleep/constants/enums';

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
