/**
 * Возможные значения статусов активности пользователя.
 * @TODO добавить статусы userStatusEmpty, userStatusRecently, userStatusLastWeek, userStatusLastMonth
 */
type TUserStatusValue = 'userStatusOnline' | 'userStatusOffline';

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
