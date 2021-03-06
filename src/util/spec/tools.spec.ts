import { describe, expect, it } from '@jest/globals';
import moment from 'moment-timezone';

import { overrideTime } from './tools';

/**
 * Проверка работы утилит для тестирования.
 */
describe('tools.spec', () => {
  // Работоспособность моков времени.
  it('overrideTime', () => {
    overrideTime('2000-01-01T18:30:00.000Z');
    const formatted = moment.utc().format('HH:mm:ss');
    expect(formatted).toBe('18:30:00');
  });
});
