/**
 * Песочница для проверки печати енамов.
 * Запускать: 
 * npx tsc ./src/temp/enums.ts
 * node ./src/temp/enums.js
 */

enum ETest {
  STATE_ZERO,
  STATE_ONE,
  STATE_TWO
}

const state = ETest.STATE_ZERO;

console.log(ETest[ETest.STATE_ZERO]);
console.log(ETest[ETest.STATE_ONE]);
console.log(ETest[ETest.STATE_TWO]);
console.log(ETest[state]);
