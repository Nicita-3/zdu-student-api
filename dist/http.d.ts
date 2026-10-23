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
export declare function setUserAgent(value: string | undefined): void;
/**
 * Поточний User-Agent, який бібліотека додає до запитів.
 * @category Config
 */
export declare function getUserAgent(): string | undefined;
/** fetch з доданим User-Agent (якщо він не заданий у самому запиті) */
export declare function fetch(input: string, init?: RequestInit): Promise<Response>;
