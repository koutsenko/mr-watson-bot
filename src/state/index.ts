import { IAppState } from '../types/state';

/**
 * Фабрика начального глобального состояния приложения.
 */
const buildInitialState = (): IAppState => ({
  bot_module: null,
  human_access_hash: null,
  human_module: null,
  jobs: []
});

/**
 * Мутируемое глобальное состояние приложения.
 */
export const appState: IAppState = buildInitialState();

/**
 * Установка начального глобального состояния.
 */
export const setInitialGlobalState = (): void => {
  const initialState = buildInitialState();

  appState.bot_module = initialState.bot_module;
  appState.human_access_hash = initialState.human_access_hash;
  appState.human_module = initialState.human_module;
  appState.jobs = initialState.jobs;
};

/**
 * Настройка мягкого завершения работы.
 */
export const setupGracefulShutdown = (): void => {
  process.once('SIGINT', () => {
    appState.jobs.forEach((job) => job.cancel());
    appState.bot_module?.stop('SIGINT');
  });
  process.once('SIGTERM', () => {
    appState.jobs.forEach((job) => job.cancel());
    appState.bot_module?.stop('SIGTERM');
  });
};
