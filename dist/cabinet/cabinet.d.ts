import { Discipline, Disciplines, Data, Scores } from './types.js';
/**
 * Клас кабінету студента
 * @category Cabinet
 */
export declare class Cabinet {
    /**
     * Прізвище користувача
     */
    login: string;
    /**
     * Пароль від кабінету студента
     */
    password: string;
    /**
     * ID сесії користувача
     */
    sesID?: string;
    /**
     * GUID сесії з cookie
     */
    sessGUID?: string;
    /**
     * Семестр для пошуку оцінок (0 - перший, 1 - другий)
     */
    semester: 0 | 1;
    /**
     * Список дисциплін {@link Discipline}
     */
    disciplines: Discipline[];
    /**
     * Данні студента {@link Data}
     */
    data?: Data;
    /**
     * Оціки з усіх предметів {@link Scores}
     */
    allScores?: Scores[];
    /**
     * Конструктор
     * @param login - Прізвище користувача
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
     * Отримати дисципліни поточного семестру студента
     * @returns Масив дисциплін {@link Disciplines}
     */
    getDisciplines(): Promise<Disciplines>;
    /**
     * Отримати анкетні данні студента
     * @returns Об'єкт {@link ata}
     */
    getData(): Promise<Data>;
    /**
     * Отримати оцінки з всіх предметів
     */
    getAllScores(semester?: 0 | 1): Promise<Scores[]>;
}
