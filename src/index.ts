import { config } from 'dotenv';

import { handleVarsError, varsAreSet } from './checks/variables';
import * as Messages from './constants/messages';
import { initSleepJob } from './jobs/sleep';
import { handleBotError, initBot } from './modules/bot';
import { handleHumanError, initHuman } from './modules/human';

/**
 * Точка входа.
 */
const EP = async (): Promise<void> => {
  // Загрузка и проверка переменных окружения
  if (config().error || !varsAreSet()) {
    handleVarsError();
  }

  // Инициализация модуля bot
  let bot_module;
  try {
    bot_module = await initBot();
    console.log(Messages.SUCCESS_START_BOT);
  } catch (error) {
    handleBotError(error);
  }

  // Инициализация модуля human
  let human_module, human_access_hash;
  try {
    [human_module, human_access_hash] = await initHuman();
    console.log(Messages.SUCCESS_START_HUMAN);
  } catch (error) {
    handleHumanError(error);
  }

  // Инициализация периодических задач
  const sleepJob = initSleepJob(human_module, bot_module, human_access_hash);

  // Пост-инициализация. Поддержка "мягкого" завершения работы
  process.once('SIGINT', () => {
    sleepJob.cancel();
    bot_module.stop('SIGINT');
  });
  process.once('SIGTERM', () => {
    sleepJob.cancel();
    bot_module.stop('SIGTERM');
  });
  console.log(Messages.SUCCESS_START);
};

console.log('hi');
EP();
