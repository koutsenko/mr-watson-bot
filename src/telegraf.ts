import { Telegraf } from 'telegraf';

import * as Messages from './messages';

/**
 * Декоратор для хэндлеров телеграфа, добавляет проверку на владельца.
 * Подразумевается, что первый аргумент хэндлера - это контекст бота.
 */
const wrapOwner = (originalMethod) => (...args) => {
    const ctx = args[0];
    if (String(ctx?.update?.message?.from?.id) !== process.env.OWNER_CHAT_ID) {
        return;
    }

    return originalMethod.apply(this, args);
};

const handleHelp = wrapOwner(ctx => ctx.reply(Messages.MSG_STICKER));
const handleStart = wrapOwner(ctx => ctx.reply(Messages.MSG_WELCOME));
const handleSticker = wrapOwner(ctx => ctx.reply(Messages.MSG_SUPER));
const handleHi = wrapOwner(ctx => ctx.reply(Messages.MSG_HELLO));

export const initBot = async (): Promise<Telegraf> => {
    const bot = new Telegraf(process.env.BOT_TOKEN);
    bot.start(handleStart);
    bot.help(handleHelp);
    bot.on('sticker', handleSticker);
    bot.hears('hi', handleHi);
    try {
        await bot.launch();
    } catch (err) {
        throw err;
    }

    return bot;
};
