/**
 * Песочница для проверки библиотеки prompt.
 * Запускать: node ./src/temp/prompt.js.
 */

// eslint-disable-next-line
const prompt = require('prompt');

const ask_phone = async () => {
  let phone;

  prompt.start();
  try {
    const result = await prompt.get(['phone']);
    phone = result.phone;
  } catch (error) {
    console.log(error);
  }
  console.log(phone);
};

ask_phone();
