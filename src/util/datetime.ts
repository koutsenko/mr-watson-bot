import moment from 'moment-timezone';

/**
 * Вычисляет признак позднего вечера.
 */
export const isLateEvening = () => {
    const hour = moment.tz('Europe/Moscow').hour();
    const result = hour === 23;

    return result;
};

/**
 * Вычисляет признак поздней ночи.
 */
export const isNight = () => {
    const hour = moment.tz('Europe/Moscow').hour();
    const result = hour >= 0 && hour < 5;

    return result;
};
