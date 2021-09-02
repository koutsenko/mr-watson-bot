import { IContext } from '../../../modules/bot';
import { appState } from '../../../state';
import { IUser } from '../../../types/telegram-api';
import { shouldCheckStatus, shouldGoSleep } from '../checks/tooLateOnline';
import { EScenarioState, scenarioState, setScenarioState } from '../state';

/**
 * Обработка сообщения от пользователя - ответ на вопрос почему не спишь.
 *
 * @param ctx Контекст модуля бота.
 */
export const handleSleepAnswer = (ctx: IContext): void => {
  ctx.reply('Ты дал какой-то ответ');
  setScenarioState(EScenarioState.STATE_IDLE);
};

/**
 * Периодическая обработка состояния STATE_IDLE.
 */
export const handleIdleStateTick = async (): Promise<void> => {
  const { human_module, human_access_hash, bot_module } = appState;
  const id = process.env.OWNER_CHAT_ID;

  // Если неактуально, идлим дальше
  if (!shouldCheckStatus()) {
    return;
  }

  // Запрашиваем статус, если онлайн - напоминаем и начинаем отслеживать
  const result: IUser = await human_module.getUser(id, human_access_hash);
  const { status } = result.user;
  if (shouldGoSleep(status)) {
    bot_module.telegram.sendMessage(id, 'Пора спать!');
    setScenarioState(EScenarioState.STATE_WAITING_FOR_SLEEP, { ticks: 0 });
  }
};

/**
 * Периодическая обработка состояния STATE_WAITING_FOR_SLEEP.
 */
export const handleWaitingForSleepTick = async (): Promise<void> => {
  const { human_module, human_access_hash, bot_module } = appState;
  const id = process.env.OWNER_CHAT_ID;

  // Если уже неактуально, переводим сценарий в режим идла.
  if (!shouldCheckStatus()) {
    setScenarioState(EScenarioState.STATE_IDLE);
    return;
  }

  // Если 5 минут не прошло, продолжаем ждать, используя ежеминутную джобу сценария.
  const ticks = scenarioState.data.ticks + 1;
  if (ticks < 5) {
    setScenarioState(EScenarioState.STATE_WAITING_FOR_SLEEP, { ticks });
    return;
  }

  // Если после окончания слежения все равно не спит - начинаем выяснять почему.
  const result: IUser = await human_module.getUser(id, human_access_hash);
  const { status } = result.user;
  if (shouldGoSleep(status)) {
    bot_module.telegram.sendMessage(id, 'Почему ты не спишь? Жду ответа');
    setScenarioState(EScenarioState.STATE_WAITING_FOR_ANSWER, { ticks: 0 });
  } else {
    setScenarioState(EScenarioState.STATE_IDLE);
  }
};

/**
 * Периодическая обработка состояния STATE_WAITING_FOR_ANSWER.
 */
export const handleWaitingForAnswerTick = (): void => {
  // Если 5 минут не прошло, продолжаем ждать, используя ежеминутную джобу сценария.
  const ticks = scenarioState.data.ticks + 1;
  if (ticks < 5) {
    setScenarioState(EScenarioState.STATE_WAITING_FOR_ANSWER, { ticks });
    return;
  }

  // Иначе, если ответа нет - ну чтож, мы не можем заставлять... Идлим обратно.
  setScenarioState(EScenarioState.STATE_IDLE);
};
