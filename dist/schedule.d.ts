import { BaseLesson, DetailedLesson, Faculty, ScheduleTypes } from './types.js';
/**
 * Клас розкладу
 * @category Schedule
 */
export declare class Schedule {
    /**
    * Тип розкладу.
    *
    * Типи: group, teacher, room.
    */
    type: ScheduleTypes;
    /**
    * Група
    */
    group: string;
    /**
    * Id групи
    */
    groupId?: number;
    /**
    * Викладач
    */
    teacher: string;
    /**
    * Id викладача
    */
    teacherId?: number;
    /**
    * Аудиторія
    */
    room: string;
    /**
    * Id аудиторії
    */
    roomId?: number;
    /**
     * Факультет.
     *
     * @example
     * Можна призначити одну з констант з `faculties`, наприклад:
     * ```ts
     * schedule.faculty = faculties.physicsMath;
     * console.log(schedule.faculty.id);   // 1001
     * console.log(schedule.faculty.name); // 'Фізико-математичний факультет'
     * ```
     */
    faculty: Faculty;
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
    /**
    * Повертає список пар (розклад)
    *
    * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
    *
    * @example
    * ```ts
    * import { Schedule, scheduleErrors } from "./index.ts";
    * const schedule = new Schedule();
    * schedule.group = '23Бд-СОінф123' // встановлюєм неправильну назву групи
    * schedule.type = 'group' // встановлєм тип пошуку по групі
    * schedule.rosText = true; // встановлюєм окремі стовпчики
    * schedule.allStreamComponents = true; // встановлюєм повний склад потоку
    * try {
    *   const mySchedule = await schedule.getSchedule();
    *   console.log("Розклад:", mySchedule);
    * } catch (err: any) {
    *   // Отримуєм помилку тому що ми неправильно вказали назву групи
    *   console.error(err.message); // Поверне: "{"error_message":"Об‘єкт - 23Бд-СОінф123 - Об‘єкт не знайдено  ","errorcode":"-90"}"
    *   console.error(scheduleErrors[JSON.parse(err.message).errorcode]); // Поверне: "Об`єкт, для якого потрібно показати розклад, не знайдено"
    * }
    * ```
    *
    * @remarks
    * У `err.message` може повертатися простий текст помилки,
    * або об’єкт у форматі:
    * ```JSON
    * {
    *   "error_message": "Текст помилки",
    *   "errorcode": "Код помилки"
    * }
    * ```
    *
    * Де:
    * - `error_message` - текст помилки відповідно до {@link scheduleErrors}
    * - `errorcode` - код помилки відповідно до {@link scheduleErrors}
    */
    getSchedule(): Promise<DetailedLesson[] | BaseLesson[]>;
    private encodeCP1251;
}
