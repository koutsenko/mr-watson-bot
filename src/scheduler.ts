/**
 * Модуль планировщика задач, задействует библиотеку node-schedule.
 * Библиотечная документация - https://www.npmjs.com/package/node-schedule.
 */
import { Telegraf } from "telegraf";
import * as MTProto from '@mtproto/core';
import * as schedule from "node-schedule";
import { everyMinute } from "./constants/jobs";

/**
 * Модуль проверки качества сна патрона.
 *
 * Пока что не изменяет сам инстанс бота.
 * Только создает регулярную задачу, в которой задействует его.
 *
 * @param eye Инстанс глаза, который смотрит за происходящим.
 * @param bot Инстанс бота, который дает обратную связь.
 */
export const initSleep = (eye: MTProto, bot: Telegraf, access_hash) => {
    const job = schedule.scheduleJob(everyMinute, async () => {
        const result = await eye.getUser(process.env.OWNER_CHAT_ID, access_hash);
        const { status } = result.user;
        bot.telegram.sendMessage(process.env.OWNER_CHAT_ID, JSON.stringify(status));
    });

    return job;
};