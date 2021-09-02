import { IAppState } from '../types/state';

/**
 * Мутируемое глобальное состояние приложения.
 */
export const appState: IAppState = {
  bot_module: null,
  human_access_hash: null,
  human_module: null,
  jobs: []
};

/**
 * Настройка мягкого завершения работы.
 */
export const setupAppStateShutdown = (): void => {
  process.once('SIGINT', () => {
    appState.jobs.forEach((job) => job.cancel());
    appState.bot_module.stop('SIGINT');
  });
  process.once('SIGTERM', () => {
    appState.jobs.forEach((job) => job.cancel());
    appState.bot_module.stop('SIGTERM');
  });
};
