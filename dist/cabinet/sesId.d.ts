import { SessionData } from "./types";
/**
 * Отримати sesID та sessGUID користувача
 * @category Cabinet
 * @param family - прізвище користувача
 * @param password - пароль
 * @returns Об'єкт { sesID, sessGUID }
 */
export declare function getSesId(family: string, password: string): Promise<SessionData>;
