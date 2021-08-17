import * as Messages from '../constants/messages';

/**
 * Проверка переменных окружения.
 *
 * @returns Результат проверки
 */
export const checkConfigVariablesSuccess = (): boolean => {
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
