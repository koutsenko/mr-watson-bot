/**
 * Базовый модуль для работы с mtproto API.
 * Основан на примере https://mtproto-core.js.org/docs/setup-handle-errors.
 */
import * as path from 'path';
import MTProto from '@mtproto/core';
import { sleep } from '@mtproto/core/src/utils/common';
import { IInputUser } from '../types/telegram-api';

/**
 * Класс-обертка над методами @mtproto/core. Назначение:
 * - инициализация со своими переменными окружения и временным файлом;
 * - подмножество Telegram API с документацией из https://core.telegram.org/methods.
 */
export default class API_mtproto {
  /**
   * Ссылка на объект mtproto.
   */
  mtproto: MTProto = null;

  /**
   * Инициализация объекта mtproto.
   */
  constructor() {
    this.mtproto = new MTProto({
      api_id: process.env.USER_API_ID,
      api_hash: process.env.USER_API_HASH,
      storageOptions: {
        path: path.resolve(__dirname, '..', 'data', 'eye.json')
      }
    });
  }

  /**
   * Обертка над mtproto.call со своей обработкой ошибок.
   * Это приватный метод, не предлагается к использованию снаружи.
   * Вместо него следует использовать реализации signIn, getSelf и т.п.
   *
   * @param method Telegram API метод, см. https://core.telegram.org/methods.
   * @param [params] Параметры к методу, см. документацию на конкретный метод.
   * @param [options] Настройки @mtproto/core.
   */
  call = async (method, params = {}, options = {}) => {
    try {
      const result = await this.mtproto.call(method, params, options);

      return result;
    } catch (error) {
      console.log(`${method} error:`, error);

      const { error_code, error_message } = error;
      if (error_code === 420) {
        const seconds = Number(error_message.split('FLOOD_WAIT_')[1]);
        const ms = seconds * 1000;

        await sleep(ms);

        return this.call(method, params, options);
      }

      if (error_code === 303) {
        const [type, dcIdAsString] = error_message.split('_MIGRATE_');

        const dcId = Number(dcIdAsString);

        // If auth.sendCode call on incorrect DC need change default DC, because
        // call auth.signIn on incorrect DC return PHONE_CODE_EXPIRED error
        if (type === 'PHONE') {
          await this.mtproto.setDefaultDc(dcId);
        } else {
          Object.assign(options, { dcId });
        }

        return this.call(method, params, options);
      }

      return Promise.reject(error);
    }
  };

  /**
   * Авторизует пользователя через подтвержденный номер телефона.
   * См. https://core.telegram.org/method/auth.signIn.
   *
   * @param phone_code Valid numerical code from the SMS-message.
   * @param phone_code_hash SMS-message ID, obtained from auth.sendCode.
   * @param phone_number Phone number in the international format.
   */
  signIn = (
    phone_code: string,
    phone_number: string,
    phone_code_hash: string
  ) => this.call('auth.signIn', { phone_code, phone_number, phone_code_hash });

  /**
   * Получить информацию о себе, используется для проверки факта авторизации.
   * См. https://core.telegram.org/constructor/inputUserSelf.
   */
  getSelf = async () => {
    try {
      const user = await this.call('users.getFullUser', {
        id: { _: 'inputUserSelf' }
      });
      return user;
    } catch (error) {
      return null;
    }
  };

  /**
   * Возвращает расширенную информацию о пользователе по ID и access hash.
   * См. https://core.telegram.org/method/users.getFullUser.
   *
   * @param user_id User ID.
   * @param access_hash Access hash.
   */
  getUser = async (user_id, access_hash) => {
    try {
      const inputUser: IInputUser = {
        _: 'inputUser',
        user_id,
        access_hash
      };
      const user = await this.call('users.getFullUser', { id: inputUser });
      return user;
    } catch (error) {
      return null;
    }
  };

  /**
   * Запрос одноразового кода для авторизации.
   * См. https://core.telegram.org/method/auth.sendCode.
   *
   * @param phone_number Phone number in international format.
   */
  sendCode = (phone_number: string) =>
    this.call('auth.sendCode', {
      phone_number,
      settings: {
        _: 'codeSettings'
      }
    });

  /**
   * Запрос конфигурации для двухфакторной аутентификации по паролю.
   * См. https://core.telegram.org/method/account.getPassword.
   */
  getPassword = () => this.call('account.getPassword');

  /**
   * Двухфакторная аутентификация с использованием засоленного пароля.
   * См. https://core.telegram.org/method/auth.checkPassword.
   *
   * @param srp_id SecureRemotePassword protocol parameter.
   * @param A SecureRemotePassword protocol parameter.
   * @param M1 SecureRemotePassword protocol parameter.
   */
  checkPassword = ({ srp_id, A, M1 }) =>
    this.call('auth.checkPassword', {
      password: {
        _: 'inputCheckPasswordSRP',
        srp_id,
        A,
        M1
      }
    });
}
