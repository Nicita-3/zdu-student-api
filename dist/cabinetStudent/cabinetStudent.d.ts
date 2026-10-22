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
     * Данні студента {@link DataStudent}
     */
    data?: DataStudent;
    /**
     * Оцінки з усіх предметів {@link Scores}
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
     * Встановити семестр
     * @param semester - Семестр в форматі рядка або числа, якщо не передавати згенерується ймовірний семестр
     */
    setSemester(semester?: 1 | 2 | '1' | '2'): void;
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
     * @returns Об'єкт {@link DataStudent}
     */
    getData(): Promise<DataStudent>;
    /**
     * Отримати курс студента
     * @returns курс (число) або undefined
     */
    getCourse(): Promise<number | undefined>;
    /**
     * Отримати свої оцінки з окремого предмета
     * @param prId - ID дисципліни (див. {@link Discipline})
     * @param semester - Семестр, за замовчуванням {@link CabinetStudent.semester}
     * @returns Оцінки з предмета {@link Scores}
     */
    getScores(prId: string, semester?: 1 | 2): Promise<Scores>;
    /**
     * Отримати свої оцінки з усіх предметів поточного семестру
     * @param semester - Семестр, за замовчуванням {@link CabinetStudent.semester}
     * @returns Масив оцінок {@link Scores} (тільки успішно отримані предмети)
     */
    getAllScores(semester?: 1 | 2): Promise<Scores[]>;
}
