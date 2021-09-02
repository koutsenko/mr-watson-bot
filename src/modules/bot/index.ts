import { Telegraf } from 'telegraf';

import * as Messages from '../../constants/messages';
import { appState } from '../../state';
import { log } from '../../util/log';

interface IBotError extends Error {
  response?: {
    error_code: number;
    description: string;
  };
}

export interface IContext {
  reply: (arg: string) => void;
  update?: {
    message?: {
      from?: {
        id;
      };
    };
  };
}

/**
 * Обработчик ошибки инициализации бота.
 */
export const handleBotError = (error: IBotError): void => {
  if (error?.response?.error_code === 401 && error?.response?.description === 'Unauthorized') {
    log(`Bot module error: ${Messages.ERROR_UNAUTHORIZED}`);
  } else {
    log(`Bot module error UNKNOWN: ${error}`);
  }

  process.exit();
};

/**
 * Декоратор для хэндлеров телеграфа, добавляет проверку на владельца.
 * Подразумевается, что первый аргумент хэндлера - это контекст бота.
 */
export const wrapOwner =
  (originalMethod: (ctx: IContext) => void): ((ctx: IContext) => void) =>
  (...args: IContext[]) => {
    const ctx = args[0];
    if (String(ctx?.update?.message?.from?.id) !== process.env.OWNER_CHAT_ID) {
      return;
    }

    return originalMethod.apply(this, args);
  };

/**
 * Инициализация модуля с Telegram Bot API.
 */
export const initBot = async (): Promise<void> => {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  await bot.launch();

  appState.bot_module = bot;
};
