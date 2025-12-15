/**
 * Перевірка на валідність сесії
 * @category Cabinet
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @returns boolean значення.
 */
export declare function isValidSession(sesId: string, sessGUID: string): Promise<boolean>;
