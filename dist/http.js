import crossFetch, { Headers } from 'cross-fetch';
const isNode = typeof process !== 'undefined' && !!process.versions?.node;
// У браузері User-Agent не чіпаємо: його або ігнорують, або він ламає CORS
let userAgent = isNode
    ? 'zdu-student-api (+https://github.com/Nicita-3/zdu-student-api)'
    : undefined;
/**
 * Задати User-Agent для всіх запитів до dekanat.zu.edu.ua,
 * щоб адміністрація бачила, який застосунок надсилає запити.
 * @category Config
 * @param value - Наприклад `'StudentPlus/1.0.17 (+https://student-plus.biz.ua; mail@example.com)'`.
 * Порожній рядок або `undefined` — не надсилати власний User-Agent.
 *
 * @example
 * ```ts
 * import { setUserAgent } from 'zdu-student-api';
 * setUserAgent('StudentPlus/1.0.17 (+https://student-plus.biz.ua)');
 * ```
 */
export function setUserAgent(value) {
    userAgent = value || undefined;
}
/**
 * Поточний User-Agent, який бібліотека додає до запитів.
 * @category Config
 */
export function getUserAgent() {
    return userAgent;
}
/** fetch з доданим User-Agent (якщо він не заданий у самому запиті) */
export function fetch(input, init = {}) {
    if (!userAgent)
        return crossFetch(input, init);
    const headers = new Headers(init.headers);
    if (!headers.has('User-Agent'))
        headers.set('User-Agent', userAgent);
    return crossFetch(input, { ...init, headers });
}
