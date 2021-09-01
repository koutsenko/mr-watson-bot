import * as MTProto from '@mtproto/core';
import * as schedule from 'node-schedule';
import { Telegraf } from 'telegraf';

/**
 * Глобальное состояние приложения.
 *
 * @property human_module Модуль для запроса данных от лица человека.
 * @property human_access_hash Хэш, без которого не получится делать запросы.
 * @property bot_module Модуль бота для взаимодействия с человеком.
 * @property jobs Массив запланированных задач.
 */
export interface IAppState {
  human_module: MTProto;
  human_access_hash: string;
  bot_module: Telegraf;
  jobs: Array<schedule>;
}
