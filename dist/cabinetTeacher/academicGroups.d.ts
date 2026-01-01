import { AcademicGroups } from './types.js';
/**
 * Отримати всі академічні групи
 * @category CabinetTeacher
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
 * @returns Об'єкт академічних груп {@link AcademicGroups}
 */
export declare function getAcademicGroups(sesId: string, sessGUID: string): Promise<AcademicGroups>;
