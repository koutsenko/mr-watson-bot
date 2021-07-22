import { config } from 'dotenv';

import { errorUnauthorized, successStart } from './messages';
import { initBot } from './telegraf';

/**
 * Стартовые проверки конфигурации.
 *
 * @returns Результат проверки
 */
const check = (): boolean => {
    let result: boolean = true;

    if (!process.env.BOT_TOKEN) {
        console.error('Error: no BOT_TOKEN found, please check your .env config');
        result = false;
    }

    return result;
}

/**
 * Точка входа.
 */
const EP = (): void => {
    config();
    const checkResult: boolean = check();

    if (!checkResult) {
        return;
    }

    // Асинхронная функция вернет промис, ошибку ловим через catch() вместо try/catch.
    // Важно в catch() вернуть ошибку и потом в then() проверить ее наличие.
    initBot().catch(error => {
        if (error?.response?.error_code === 401 && error?.response?.description === 'Unauthorized') {
            console.log(`Error: ${errorUnauthorized}`);
        }  else {
            console.log('Error UNKNOWN:', error);
        }

        return error;
    }).then((error) => {
        if (error) {
            return;
        }

        console.log(successStart);
    });
}

EP();
