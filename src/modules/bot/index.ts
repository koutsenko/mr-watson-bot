import { Telegraf } from 'telegraf';

import * as Messages from '../../constants/messages';

interface IBotError extends Error {
  response?: {
    error_code: number;
    description: string;
  };
}

/**
 * Обработчик ошибки инициализации бота.
 */
export const handleBotError = (error: IBotError): void => {
  if (error?.response?.error_code === 401 && error?.response?.description === 'Unauthorized') {
    console.log(`Bot module error: ${Messages.ERROR_UNAUTHORIZED}`);
  } else {
    console.log('Bot module error UNKNOWN:', error);
  }

  process.exit();
};

/**
 * Декоратор для хэндлеров телеграфа, добавляет проверку на владельца.
 * Подразумевается, что первый аргумент хэндлера - это контекст бота.
 */
const wrapOwner =
  (originalMethod) =>
  (...args) => {
    const ctx = args[0];
    if (String(ctx?.update?.message?.from?.id) !== process.env.OWNER_CHAT_ID) {
      return;
    }

    return originalMethod.apply(this, args);
  };

const handleHelp = wrapOwner((ctx) => ctx.reply(Messages.MSG_STICKER));
const handleStart = wrapOwner((ctx) => ctx.reply(Messages.MSG_WELCOME));
const handleSticker = wrapOwner((ctx) => ctx.reply(Messages.MSG_SUPER));
const handleHi = wrapOwner((ctx) => ctx.reply(Messages.MSG_HELLO));

/**
 * Инициализация модуля с Telegram Bot API.
 */
export const initBot = async (): Promise<Telegraf> => {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  bot.start(handleStart);
  bot.help(handleHelp);
  bot.on('sticker', handleSticker);
  bot.hears('hi', handleHi);
  await bot.launch();

  return bot;
};