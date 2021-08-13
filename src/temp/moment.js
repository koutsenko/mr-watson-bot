/**
 * Песочница для проверки таймзон moment.
 * Запускать: node ./src/temp/moment.
 */

// eslint-disable-next-line
const moment = require('moment-timezone');

const query_date = () => {
  const date1 = moment().utc();
  const date2 = moment().utc(true);
  const date3 = moment().tz('Europe/Moscow');

  console.log(date1.hour(), date2.hour(), date3.hour());
};

query_date();
