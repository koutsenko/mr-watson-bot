import { IContext } from '../../../modules/bot';
import { IAppState } from '../../../types/state';
import { IUser } from '../../../types/telegram-api';
import { shouldCheckStatus, shouldGoSleep } from '../checks/tooLateOnline';
import { EScenarioState, localState, setState } from '../state';

export const handleSleepAnswer = (ctx: IContext): void => {
  ctx.reply('Ты дал какой-то ответ');
  setState(EScenarioState.STATE_IDLE);
};

export const handleIdleStateTick = async (state: IAppState): Promise<void> => {
  const { human_module, human_access_hash, bot_module } = state;
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
    setState(EScenarioState.STATE_WAITING_FOR_SLEEP, { ticks: 0 });
  }
};

export const handleWaitingForSleepTick = async (state: IAppState): Promise<void> => {
  const { human_module, human_access_hash, bot_module } = state;
  const id = process.env.OWNER_CHAT_ID;

  // Если уже неактуально, переводим сценарий в режим идла.
  if (!shouldCheckStatus()) {
    setState(EScenarioState.STATE_IDLE);
    return;
  }

  // Если 5 минут не прошло, продолжаем ждать, используя ежеминутную джобу сценария.
  const ticks = localState.data.ticks + 1;
  if (ticks < 5) {
    setState(EScenarioState.STATE_WAITING_FOR_SLEEP, { ticks });
    return;
  }

  // Если после окончания слежения все равно не спит - начинаем выяснять почему.
  const result: IUser = await human_module.getUser(id, human_access_hash);
  const { status } = result.user;
  if (shouldGoSleep(status)) {
    bot_module.telegram.sendMessage(id, 'Почему ты не спишь? Жду ответа');
    setState(EScenarioState.STATE_WAITING_FOR_ANSWER, { ticks: 0 });
  } else {
    setState(EScenarioState.STATE_IDLE);
  }
};

export const handleWaitingForAnswerTick = (): void => {
  // Если 5 минут не прошло, продолжаем ждать, используя ежеминутную джобу сценария.
  const ticks = localState.data.ticks + 1;
  if (ticks < 5) {
    setState(EScenarioState.STATE_WAITING_FOR_ANSWER, { ticks });
    return;
  }

  // Иначе, если ответа нет - ну чтож, мы не можем заставлять... Идлим обратно.
  setState(EScenarioState.STATE_IDLE);
};
