import { Scores } from './types.js';
/**
 * Отримати оцінки поточного студента з вибраного предмета
 * @category CabinetStudent
 * @remarks
 * Журнал показує лише оцінки студента, який переглядає сторінку,
 * рядки інших студентів анонімізовані, тому вони не повертаються.
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @param prId - ID дисципліни
 * @param semester - Семестр
 * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
 * @returns Оцінки з предмета {@link Scores}
 */
export declare function getScores(sesId: string, sessGUID: string, prId: string, semester: 1 | 2): Promise<Scores>;
