import { Disciplines } from './types.js';
/**
 * Отримати всі дисципліни студента
 * @category CabinetStudent
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
 * @returns Масив дисциплін {@link Disciplines}
 */
export declare function getDisciplines(sesId: string, sessGUID: string): Promise<Disciplines>;
/**
 * Отримати поточні дисципліни студента
 * @category CabinetStudent
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
 * @returns Масив дисциплін {@link Disciplines}
 */
export declare function getСurrentDisciplines(sesId: string, sessGUID: string): Promise<Disciplines>;
