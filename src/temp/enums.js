/**
 * Песочница для проверки печати енамов.
 * Запускать:
 * npx tsc ./src/temp/enums.ts
 * node ./src/temp/enums.js
 */
var ETest;
(function (ETest) {
    ETest[ETest["STATE_ZERO"] = 0] = "STATE_ZERO";
    ETest[ETest["STATE_ONE"] = 1] = "STATE_ONE";
    ETest[ETest["STATE_TWO"] = 2] = "STATE_TWO";
})(ETest || (ETest = {}));
var state = ETest.STATE_ZERO;
console.log(ETest[ETest.STATE_ZERO]);
console.log(ETest[ETest.STATE_ONE]);
console.log(ETest[ETest.STATE_TWO]);
console.log(ETest[state]);
