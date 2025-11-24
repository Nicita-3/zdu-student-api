import { Faculty } from "../types";
/**
 * Клас розкладу
 */
export declare class Schedule {
    /**
    * Група
    */
    group: string;
    /**
     * Факультет.
     *
     * Можна призначити одну з констант з `faculties`, наприклад:
     * ```ts
     * schedule.faculty = faculties.physicsMath;
     * console.log(schedule.faculty.id);   // 1001
     * console.log(schedule.faculty.name); // "Фізико-математичний факультет"
     * ```
     */
    faculty: Faculty;
    /**
    * Викладач
    */
    teacher: string;
    /**
    * Курс
    *
    * `0` - не вибрано
    */
    course: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /**
    * Початкова дата розкладу
    */
    beginDate: Date;
    /**
    * Кінцева дата розкладу (за промовчанням +7 днів)
    */
    endDate: Date;
    /**
    * Показувати пусті дні - false
    */
    showEmpty: boolean;
    /**
     * false - сформований текст (за промовчанням)
     * true - окремі стовпчики
     */
    private _rosText;
    /**
     * Показувати повний склад потоку (тільки для rosText=true)
     */
    allStreamComponents: boolean;
    set rosText(value: boolean);
    get rosText(): boolean;
    constructor();
    /**
    * Повертає список груп
    */
    getGroups(): Promise<string[]>;
    /**
    * Повертає список викладачів
    */
    getTeachers(): Promise<string[]>;
    getSchedule(): Promise<string>;
}
