import { SessionData } from './types.js';
/**
 * Отримати sesID та sessGUID користувача
 * @category Cabinet
 * @param login - Прізвище користувача
 * @param password - Пароль
 * @param type - тип кабінету 'student' | 'teacher'
 * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
 * @returns Об'єкт { sesID, sessGUID }
 */
export declare function getSesId(login: string, password: string, type: 'student' | 'teacher'): Promise<SessionData>;
/**
 * Перевірка на валідність сесії
 * @category Cabinet
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @param type - тип кабінету 'student' | 'teacher'
 * @returns boolean значення.
 */
export declare function isValidSession(sesId: string, sessGUID: string, type: 'student' | 'teacher'): Promise<boolean>;
/**
 * Генерує cookie строку з DateTime та SessGUID
 * @category Cabinet
 * @param sessGUID - GUID сесії з cookie
 * @returns cookie рядок
 */
export declare function generateCookieString(sessGUID: string): string;
/**
 * Перевірка чи є отримана сторінка сторінкою авторизації
 * @category Cabinet
 * @returns true | false
 */
export declare function isLoginPage(html: string): boolean;
