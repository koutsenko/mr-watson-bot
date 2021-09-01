import { IAppState } from '../types/state';

/**
 * Инициализация начального стейта приложения.
 */
export const initEmptyAppState = (): IAppState => ({
  bot_module: null,
  human_access_hash: null,
  human_module: null,
  jobs: []
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
