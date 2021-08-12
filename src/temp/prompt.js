/**
 * Песочница для проверки библиотеки prompt.
 * Запускать: node ./src/temp/prompt.js.
 */

const prompt = require('prompt');

const ask_phone = async () => {
    let phone;

    prompt.start();
    try {
        const result = await prompt.get(['phone']);
        phone = result.phone; 
    } catch (e) {
        console.log(error);
    }
    console.log(phone);
};

ask_phone();
