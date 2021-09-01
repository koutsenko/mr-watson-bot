/**
 * Песочница для проверки запуска и останова задач.
 * Запускать: node ./src/temp/task.js.
 * Через демон: nodemon ./src/temp/task.js --watch ./src/temp.
 */

// eslint-disable-next-line
const schedule = require('node-schedule');

const everySecond = '* * * * * *';

const job1 = schedule.scheduleJob(everySecond, () => {
  console.log('job1');
});

setTimeout(() => {
  job1.cancel();
}, 6000);
