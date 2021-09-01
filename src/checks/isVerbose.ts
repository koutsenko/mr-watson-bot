/**
 * Проверка на запуск в "многословном" режиме.
 */
export const isVerboseMode = (): boolean => process.env.VERBOSE === 'true';
