/**
 * Интерфейс ошибки модуля бота.
 */
export interface IBotError extends Error {
  response?: {
    error_code: number;
    description: string;
  };
}

/**
 * Интерфейс библиотечного контекста модуля бота.
 */
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
