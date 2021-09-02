import { config } from 'dotenv';

import { isVerboseMode } from './checks/isVerbose';
import { handleVarsError, varsAreSet } from './checks/variables';
import * as Messages from './constants/messages';
import { handleBotError, initBot } from './modules/bot';
import { handleHumanError, initHuman } from './modules/human';
import { init as initSleep } from './scenarios/sleep';
import { setupAppStateShutdown } from './state';
import { log } from './util/log';

/**
 * Точка входа.
 */
const EP = async (): Promise<void> => {
  // Загрузка и проверка переменных окружения
  if (config().error || !varsAreSet()) {
    handleVarsError();
  }

  // Инициализация модуля bot
  try {
    await initBot();
    log(Messages.SUCCESS_START_BOT);
  } catch (error) {
    handleBotError(error);
  }

  // Инициализация модуля human
  try {
    await initHuman();
    log(Messages.SUCCESS_START_HUMAN);
  } catch (error) {
    handleHumanError(error);
  }

  // Инициализация сценариев
  initSleep();

  // Настройка "мягкого" завершения работы
  setupAppStateShutdown();

  log(Messages.SUCCESS_START);
};

log(`Entering entry point${isVerboseMode() ? ', verbose enabled' : ''}`);
EP();
