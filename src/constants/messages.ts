// Вспомогательные методы для сборки сообщений об ошибке 
const wrapVar = variable => `missing ${variable}, check .env config`;
const wrapBotVar = variable => `${wrapVar(variable)} or contact @BotFather on Telegram`;
const wrapUserVar = variable => `${wrapVar(variable)} or https://my.telegram.org/apps`;
const wrapOwnerVar = variable => `${wrapVar(variable)} or use another bots to check your CHAT_ID`;

// Стартовые проверки
export const NO_BOT_TOKEN: string = wrapBotVar("BOT_TOKEN");
export const NO_USER_API_ID: string = wrapUserVar("USER_API_ID");
export const NO_USER_API_HASH: string = wrapUserVar("USER_API_HASH");
export const NO_OWNER_CHAT_ID: string = wrapOwnerVar("OWNER_CHAT_ID");
export const NO_USER_PHONE_NUMBER: string = wrapUserVar("USER_PHONE_NUMBER");
export const NO_USER_TG_CLOUD_PASSWORD: string = wrapUserVar("USER_TG_CLOUD_PASSWORD");

// Стартовые ошибки
export const ERROR_UNAUTHORIZED: string = "401 unauthorized, check BOT_TOKEN or @BotFather";

// Системные сообщения
export const SUCCESS_START_BOT: string = "started: bot module";
export const SUCCESS_START_EYE: string = "started: human eye";
export const SUCCESS_START: string = "started: application";

// Пользовательские фразы
export const MSG_STICKER: string = "Send me a sticker";
export const MSG_WELCOME: string = "Welcome";
export const MSG_SUPER: string = "👍";
export const MSG_HELLO: string = "Hey there";