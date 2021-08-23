/**
 * Фича: мониторинг сна
 * Пользователь: koutsenko
 */
import { IAppState } from '../../types/state';
import { initSleepJob } from './jobs/sleep';

/**
 * Инициализация.
 */
export const init = (state: IAppState): void => {
  // Инициализация задачи на опрос состояния сна.
  state.jobs.push(initSleepJob(state));
};
