import { IAppState } from '../types/state';

/**
 * Инициализация начального стейта приложения.
 *
 * @param [debug] Опциональный флаг для debug режима.
 */
export const initEmptyAppState = (debug = false): IAppState => ({
  bot_module: null,
  human_access_hash: null,
  human_module: null,
  jobs: [],
  debug
});

/**
 * Настройка мягкого завершения работы.
 *
 * @param state Стейт приложения.
 */
export const setupAppStateShutdown = (state: IAppState): void => {
  process.once('SIGINT', () => {
    state.jobs.forEach((job) => job.cancel());
    state.bot_module.stop('SIGINT');
  });
  process.once('SIGTERM', () => {
    state.jobs.forEach((job) => job.cancel());
    state.bot_module.stop('SIGTERM');
  });
};
