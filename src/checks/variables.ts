import * as Messages from '../constants/messages';
import { log } from '../util/log';

const varsMap = {
  BOT_TOKEN: Messages.NO_BOT_TOKEN,
  OWNER_CHAT_ID: Messages.NO_OWNER_CHAT_ID,
  USER_API_ID: Messages.NO_USER_API_ID,
  USER_API_HASH: Messages.NO_USER_API_HASH,
  USER_PHONE_NUMBER: Messages.NO_USER_PHONE_NUMBER,
  USER_TG_CLOUD_PASSWORD: Messages.NO_USER_TG_CLOUD_PASSWORD
};

/**
 * Обработчик ошибки инициализации переменных.
 */
export const handleVarsError = (): void => {
  log(Messages.ERROR_CONFIG_LOAD);
  process.exit();
};

/**
 * Функция проверки отдельно взятой переменной окружения.
 *
 * @param envVarName Имя переменной окружения.
 */
const varIsSet = (envVarName: string): boolean => {
  const result = !!process.env[envVarName];
  if (!result) {
    log(`Error: ${varsMap[envVarName]}`);
  }

  return result;
};

/**
 * Проверка переменных окружения.
 *
 * @returns Результат проверки, true если все нормально.
 */
export const varsAreSet = (): boolean => Object.keys(varsMap).every(varIsSet);
