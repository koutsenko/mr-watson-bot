import { config } from 'dotenv';

import * as Messages from './messages';
import { initBot } from './telegraf';

/**
 * Стартовые проверки конфигурации.
 *
 * @returns Результат проверки
 */
const check = (): boolean => {
    let result: boolean = true;

    if (!process.env.BOT_TOKEN) {
        console.error(`Error: ${Messages.NO_BOT_TOKEN}`);
        result = false;
    }

    if (!process.env.OWNER_CHAT_ID) {
        console.error(`Error: ${Messages.NO_OWNER_CHAT_ID}`);
        result = false;
    }

    return result;
}

/**
 * Точка входа.
 */
const EP = async (): Promise<void> => {
    config();
    const checkResult: boolean = check();

    if (!checkResult) {
        return;
    }

    let started = false;
    try {
        await initBot();
        started = true;
    } catch (error) {
        if (error?.response?.error_code === 401 && error?.response?.description === 'Unauthorized') {
            console.log(`Error: ${Messages.ERROR_UNAUTHORIZED}`);
        }  else {
            console.log('Error UNKNOWN:', error);
        }
    } finally {
        if (started) {
            console.log(Messages.SUCCESS_START);
        }
    }
}

EP();
