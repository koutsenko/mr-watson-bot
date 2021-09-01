/**
 * Песочница для проверки форматирования даты.
 * Запускать: node ./src/temp/dateformat.
 */

// eslint-disable-next-line
const dateformat = require('dateformat');

const now = new Date();
const variant1 = dateformat(now, 'dd.mm.yyyy HH:MM:ss');

console.log(variant1);
