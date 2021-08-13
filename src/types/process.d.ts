declare namespace NodeJS {
  /**
   * @property BOT_TOKEN Токен бота.
   */
  export interface ProcessEnv {
    BOT_TOKEN: string;
    OWNER_CHAT_ID: string;
    USER_API_ID: string;
    USER_API_HASH: string;
    USER_PHONE_NUMBER: string;
    USER_TG_CLOUD_PASSWORD: string;
  }

  // https://github.com/facebook/jest/issues/11640
  interface Global {}
}
