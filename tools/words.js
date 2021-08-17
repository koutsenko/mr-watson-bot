/* eslint-disable no-else-return */

const fs = require('fs').promises;
const path = require('path');

/**
 * Статистика слов в файле
 */
const processFile = async filePath => {
  const source = await fs.readFile(filePath, 'utf-8');

  if (source.length === 0) {
    console.error('empty js file', filePath);
    return {};
  }

  let data = source;

  // Replace newlines by spaces
  data = data.replace(/\n/g, ' ');

  // Escaped chars
  data = data.replace(/\./g, ' ');
  data = data.replace(/\(/g, ' ');
  data = data.replace(/\)/g, ' ');
  data = data.replace(/\[/g, ' ');
  data = data.replace(/\]/g, ' ');
  data = data.replace(/\//g, ' ');
  data = data.replace(/\*/g, ' ');
  data = data.replace(/\?/g, ' ');

  // Unescaped chars
  data = data.replace(/:/g, ' ');
  data = data.replace(/`/g, ' ');
  data = data.replace(/'/g, ' ');
  data = data.replace(/"/g, ' ');
  data = data.replace(/</g, ' ');
  data = data.replace(/>/g, ' ');
  data = data.replace(/,/g, ' ');
  data = data.replace(/;/g, ' ');
  data = data.replace(/!/g, ' ');
  data = data.replace(/=/g, ' ');
  data = data.replace(/{/g, ' ');
  data = data.replace(/}/g, ' ');

  // Words - js modules
  data = data.replace(/^as$/g, ' ');
  data = data.replace(/^exports$/g, ' ');
  data = data.replace(/^export$/g, ' ');
  data = data.replace(/^import$/g, ' ');
  data = data.replace(/^require$/g, ' ');

  // Words - js values
  data = data.replace(/^false$/g, ' ');
  data = data.replace(/^null$/g, ' ');
  data = data.replace(/^true$/g, ' ');
  data = data.replace(/^undefined$/g, ' ');

  // Words - js operators
  data = data.replace(/^new$/g, ' ');
  data = data.replace(/^typeof$/g, ' ');

  // Words - js objects
  data = data.replace(/^Array$/g, ' ');
  data = data.replace(/^Boolean$/g, ' ');
  data = data.replace(/^Object$/g, ' ');
  data = data.replace(/^Promise$/g, ' ');
  data = data.replace(/^String$/g, ' ');

  // Words - js declarations
  data = data.replace(/^class$/g, ' ');
  data = data.replace(/^const$/g, ' ');
  data = data.replace(/^extends$/g, ' ');
  data = data.replace(/^function$/g, ' ');
  data = data.replace(/^let$/g, ' ');
  data = data.replace(/^var$/g, ' ');

  // Words - js control flow
  data = data.replace(/^async$/g, ' ');
  data = data.replace(/^await$/g, ' ');
  data = data.replace(/^break$/g, ' ');
  data = data.replace(/^case$/g, ' ');
  data = data.replace(/^catch$/g, ' ');
  data = data.replace(/^default$/g, ' ');
  data = data.replace(/^do$/g, ' ');
  data = data.replace(/^else$/g, ' ');
  data = data.replace(/^forEach$/g, ' ');
  data = data.replace(/^for$/g, ' ');
  data = data.replace(/^finally$/g, ' ');
  data = data.replace(/^if$/g, ' ');
  data = data.replace(/^in$/g, ' ');
  data = data.replace(/^return$/g, ' ');
  data = data.replace(/^switch$/g, ' ');
  data = data.replace(/^then$/g, ' ');
  data = data.replace(/^throw$/g, ' ');
  data = data.replace(/^try$/g, ' ');
  data = data.replace(/^while$/g, ' ');
  data = data.replace(/^with$/g, ' ');

  // Words - js objects functions
  data = data.replace(/^all$/g, ' ');
  data = data.replace(/^every$/g, ' ');
  data = data.replace(/^filter$/g, ' ');
  data = data.replace(/^find$/g, ' ');
  data = data.replace(/^includes$/g, ' ');
  data = data.replace(/^indexOf$/g, ' ');
  data = data.replace(/^keys$/g, ' ');
  data = data.replace(/^map$/g, ' ');
  data = data.replace(/^reduce$/g, ' ');
  data = data.replace(/^reject$/g, ' ');
  data = data.replace(/^resolve$/g, ' ');
  data = data.replace(/^some$/g, ' ');
  data = data.replace(/^values$/g, ' ');

  // Trim spaces
  data = data.replace(/  +/g, ' ');

  const words = data.split(' ');
  const stat = words.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: acc.cur === undefined ? 1 : acc.cur + 1,
    }),
    {},
  );

  return stat;
};

/**
 * Объединение глобальной статистики и текущей статистики по файлу
 */
const mergeStats = (globalStat, currentStat) =>
  Object.keys(currentStat).reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: (globalStat[cur] === undefined ? 0 : globalStat[cur]) + currentStat[cur],
    }),
    globalStat,
  );

/**
 * Обход дерева каталогов и возврат плоского массива имен файлов
 */
const walk = async dir => {
  const files = await fs.readdir(dir);
  const promises = files.map(async file => {
    const filePath = path.join(dir, file);
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      return walk(filePath);
    } else if (stats.isFile()) {
      return filePath;
    }
  });
  const filepaths = await Promise.all(promises);
  const flatten = filepaths.flat(255);

  return flatten;
};

(async () => {
  try {
    const filepaths = await walk(path.resolve(__dirname, '..', 'src'));
    const js = filepaths.filter(f => ['.ts', '.js'].includes(path.extname(f)));
    const wordstats = await Promise.all(js.map(async item => processFile(item)));
    const wordstat = wordstats.reduce(mergeStats, {});

    const data = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>
      <body style="margin: 0;">
        <div id="report">
          <pre>
            ${JSON.stringify(wordstat, Object.keys(wordstat).sort(), 2)}
          </pre>
        </div>
      <body>
    </html>
    `;

    await fs.writeFile(path.resolve(__dirname, 'words.html'), data);
  } catch (e) {
    console.error(e);
  }
})();
