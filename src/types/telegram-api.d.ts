/**
 * Возможные значения статусов активности пользователя.
 * @TODO добавить статусы userStatusEmpty, userStatusRecently, userStatusLastWeek, userStatusLastMonth
 */
type TUserStatusValue = 'userStatusOnline' | 'userStatusOffline';

type TAlgo = {
  g;
  p;
  salt1;
  salt2;
};

/**
 * Oject contains info on user authorization.
 * https://core.telegram.org/type/auth.Authorization
 */
export interface IAuthAuthorization {
  _: string;
  srp_id: string;
  current_algo: TAlgo;
  srp_B: string;
}

/**
 * Contains info on a confirmation code message sent via SMS, phone call or Telegram.
 * https://core.telegram.org/type/auth.SentCode
 */
export interface IAuthSentCode {
  phone_code_hash: string;
}

/**
 * Defines a user for subsequent interaction.
 * https://core.telegram.org/type/InputUser
 */
export interface IInputUser {
  _: string;
  user_id: string;
  access_hash: string;
}

/**
 * Object defines a user.
 * https://core.telegram.org/type/User
 */
export interface IUser {
  user: IUserFull;
}

/**
 * Object contains extended user info.
 * https://core.telegram.org/type/UserFull
 * @TODO Описать другие поля?
 */
export interface IUserFull {
  access_hash: string;
  status: IUserStatus;
}

/**
 * User online status.
 * https://core.telegram.org/type/UserStatus
 */
export interface IUserStatus {
  _: TUserStatusValue;
  expires?: number; // только для userStatusOnline
  was_online?: number; // только для userStatusOffline
}
