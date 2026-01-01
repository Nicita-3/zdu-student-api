import { DataTeacher, AcademicGroups, AcademicGroup } from './types.js';
/**
 * Клас кабінету викладача
 * @category CabinetTeacher
 */
export declare class CabinetTeacher {
    /**
     * Логін користувача
     */
    login: string;
    /**
     * Пароль від кабінету викладача
     */
    password: string;
    /**
     * ID сесії викладача
     */
    sesID?: string;
    /**
     * GUID сесії з cookie
     */
    sessGUID?: string;
    /**
     * Семестр для пошуку оцінок (0 - перший, 1 - другий)
     */
    semester: 1 | 2;
    /**
     * Данні викладача {@link DataTeacher}
     */
    data?: DataTeacher;
    /**
     * Список академічних груп {@link AcademicGroup}
     */
    academicGroups: AcademicGroup[];
    /**
     * Конструктор
     * @param login - Логін користувача
     * @param password - Пароль
     */
    constructor(login: string, password: string);
    /**
     * Авторизація
     */
    auth(login?: string, password?: string): Promise<boolean>;
    /**
     * Базове значення семестру
     */
    private setSemester;
    /**
     * Отримання всіх данних
     */
    loadData(): Promise<boolean>;
    /**
     * Відновлення сесії
     */
    setSession(sesID: string, sessGUID: string): Promise<boolean>;
    /**
     * Перевірка валідності сесії
     */
    isValidSession(): Promise<boolean>;
    /**
     * Отримати всі академічні групи
     * @returns Об'єкт академічних груп {@link AcademicGroups}
     */
    getAcademicGroups(): Promise<AcademicGroups>;
    /**
     * Отримати анкетні данні викладача
     * @returns Об'єкт {@link Data}
     */
    getData(): Promise<DataTeacher>;
}
