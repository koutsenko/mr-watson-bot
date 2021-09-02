import { config } from 'dotenv';

import { isVerboseMode } from './checks/isVerbose';
import { handleVarsError, varsAreSet } from './checks/variables';
import * as Messages from './constants/messages';
import { handleBotError, initBotModule } from './modules/bot';
import { handleHumanError, initHumanModule } from './modules/human';
import { init as initSleepScenario } from './scenarios/sleep';
import { setupGracefulShutdown } from './state';
import { log } from './util/log';

/**
 * Точка входа.
 */
const EP = async (): Promise<void> => {
  if (config().error || !varsAreSet()) {
    handleVarsError();
  }

  try {
    await initBotModule();
    log(Messages.SUCCESS_START_BOT);
  } catch (error) {
    handleBotError(error);
  }

  try {
    await initHumanModule();
    log(Messages.SUCCESS_START_HUMAN);
  } catch (error) {
    handleHumanError(error);
  }

  initSleepScenario();

  setupGracefulShutdown();

  log(Messages.SUCCESS_START);
};

log(`Entering entry point${isVerboseMode() ? ', verbose enabled' : ''}`);
EP();
