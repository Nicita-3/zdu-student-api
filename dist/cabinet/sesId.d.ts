import { SessionData } from './types.js';
/**
 * Отримати sesID та sessGUID користувача
 * @category Cabinet
 * @param login - Прізвище користувача
 * @param password - Пароль
 * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
 * @returns Об'єкт { sesID, sessGUID }
 */
export declare function getSesId(login: string, password: string): Promise<SessionData>;
