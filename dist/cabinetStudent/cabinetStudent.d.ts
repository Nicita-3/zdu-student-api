import { Discipline, Disciplines, DataStudent, Scores } from './types.js';
/**
 * Клас кабінету студента
 * @category CabinetStudent
 */
export declare class CabinetStudent {
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
     * Семестр для пошуку оцінок (1 - перший, 2 - другий)
     */
    semester: 1 | 2;
    /**
     * Список дисциплін {@link Discipline}
     */
    disciplines: Discipline[];
    /**
     * Данні студента {@link Data}
     */
    data?: DataStudent;
    /**
     * Оціки з усіх предметів {@link Scores}
     */
    allScores?: Scores[];
    /**
     * Айді в системі оцінювання
     */
    private id?;
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
     * @returns Об'єкт дисциплін {@link Disciplines}
     */
    getDisciplines(): Promise<Disciplines>;
    /**
     * Отримати анкетні данні студента
     * @returns Об'єкт {@link Data}
     */
    getData(): Promise<DataStudent>;
    /**
     * Отримати курс студента
     * @returns курс (число) або undefined
     */
    getCourse(): Promise<number | undefined>;
    /**
     * Отримати оцінки з всіх предметів
     */
    getAllScores(semester?: 1 | 2): Promise<Scores[]>;
    /**
     * Отримати айді в системі оцінювання
     */
    getId(): Promise<string | undefined>;
}
