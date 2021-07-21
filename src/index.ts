import { config } from 'dotenv';

import { helloMessage } from './messages';
import { initBot } from './telegraf';

config();
initBot();
console.log(helloMessage);
