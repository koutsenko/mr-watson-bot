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
