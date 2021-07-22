import { Telegraf } from 'telegraf';

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

const handleHelp = wrapOwner(ctx => ctx.reply('Send me a sticker'));
const handleStart = wrapOwner(ctx => ctx.reply('Welcome'));
const handleSticker = wrapOwner(ctx => ctx.reply('👍'));
const handleHi = wrapOwner(ctx => ctx.reply('Hey there'));

export const initBot = async (): Promise<void> => {
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

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
};
