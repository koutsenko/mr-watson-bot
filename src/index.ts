import { config } from 'dotenv';

import * as Messages from './constants/messages';
import { initBot } from './telegraf';
import { initEye } from './mtproto';
import { initSleep } from './scheduler';
import { checkConfigVariables } from './checks/variables';

/**
 * Точка входа.
 */
const EP = async (): Promise<void> => {
  // Загрузка и проверка переменных окружения
  if (config().error || checkConfigVariables()) {
    process.exit();
  }

  // Инициализация бота - Telegram Bot API, библиотека telegraf
  let bot;
  let botStarted = false;
  try {
    bot = await initBot();
    botStarted = true;
  } catch (error) {
    if (
      error?.response?.error_code === 401 &&
      error?.response?.description === 'Unauthorized'
    ) {
      console.log(`Bot error: ${Messages.ERROR_UNAUTHORIZED}`);
    } else {
      console.log('Bot error UNKNOWN:', error);
    }
  } finally {
    if (!botStarted) {
      process.exit();
    }
  }
  console.log(Messages.SUCCESS_START_BOT);

  // Инициализация "человеческого глаза" - Telegram API, библиотека mtproto
  let eye;
  let access_hash;
  let eyeStarted = false;
  try {
    const data = await initEye();
    eye = data[0];
    access_hash = data[1];
    eyeStarted = true;
  } catch (error) {
    console.log('Eye error UNKNOWN:', error);
  } finally {
    if (!eyeStarted) {
      process.exit();
    }
  }
  console.log(Messages.SUCCESS_START_EYE);

  // Инициализация периодических задач
  const job = initSleep(eye, bot, access_hash);

  // Пост-инициализация. Поддержка "мягкого" завершения работы
  process.once('SIGINT', () => {
    job.cancel();
    bot.stop('SIGINT');
  });
  process.once('SIGTERM', () => {
    job.cancel();
    bot.stop('SIGTERM');
  });
  console.log(Messages.SUCCESS_START);
};

EP();
