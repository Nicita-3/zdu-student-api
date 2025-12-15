import { Scores } from './types.js';
/**
 * Отримати оцінки пвибраного предмета студента
 * @category Cabinet
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @param prId - ID дисципліни
 * @param semester - Семестр
 * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
 * @returns Масив дисциплін {@link Disciplines}
 */
export declare function getScores(sesId: string, sessGUID: string, prId: string, semester: 0 | 1): Promise<Scores>;
