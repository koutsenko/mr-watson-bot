import { config } from 'dotenv';

import * as Messages from './constants/messages';
import { initBot } from './telegraf';
import { initEye } from './mtproto';
import { initSleep } from './scheduler';

/**
 * Стартовые проверки конфигурации.
 *
 * @returns Результат проверки
 */
const check = (): boolean => {
  let result = true;

  if (!process.env.BOT_TOKEN) {
    console.error(`Error: ${Messages.NO_BOT_TOKEN}`);
    result = false;
  }

  if (!process.env.OWNER_CHAT_ID) {
    console.error(`Error: ${Messages.NO_OWNER_CHAT_ID}`);
    result = false;
  }

  if (!process.env.USER_API_ID) {
    console.error(`Error: ${Messages.NO_USER_API_ID}`);
    result = false;
  }

  if (!process.env.USER_API_HASH) {
    console.error(`Error: ${Messages.NO_USER_API_HASH}`);
    result = false;
  }

  if (!process.env.USER_PHONE_NUMBER) {
    console.error(`Error: ${Messages.NO_USER_PHONE_NUMBER}`);
    result = false;
  }

  if (!process.env.USER_TG_CLOUD_PASSWORD) {
    console.error(`Error: ${Messages.NO_USER_TG_CLOUD_PASSWORD}`);
    result = false;
  }

  return result;
};

/**
 * Точка входа.
 */
const EP = async (): Promise<void> => {
  // Загрузка и проверка переменных окружения
  config();
  const checkResult: boolean = check();
  if (!checkResult) {
    return;
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
      return;
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
      return;
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
