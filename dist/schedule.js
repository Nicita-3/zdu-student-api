import iconv from 'iconv-lite';
import fetch from 'cross-fetch';
import { faculties } from './constants.js';
/**
 * Клас розкладу
 * @category Schedule
 */
export class Schedule {
    /**
    * Тип розкладу.
    *
    * Типи: group, teacher, room.
    */
    type = 'group';
    /**
    * Група
    */
    group = '';
    /**
    * Id групи
    */
    groupId;
    /**
    * Викладач
    */
    teacher = '';
    /**
    * Id викладача
    */
    teacherId;
    /**
    * Аудиторія
    */
    room = '';
    /**
    * Id аудиторії
    */
    roomId;
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
    faculty = faculties.none;
    /**
    * Курс
    *
    * `0` - не вибрано
    */
    course = 0;
    /**
    * Початкова дата розкладу
    */
    beginDate = new Date();
    /**
    * Кінцева дата розкладу (за промовчанням +7 днів)
    */
    endDate = new Date(this.beginDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    /**
    * Показувати пусті дні - false
    */
    showEmpty = false;
    /**
     * false - сформований текст (за промовчанням)
     * true - окремі стовпчики
     */
    _rosText = false;
    /**
     * Показувати повний склад потоку (тільки для rosText=true)
     */
    allStreamComponents = false;
    set rosText(value) {
        this._rosText = value;
        if (!value)
            this.allStreamComponents = false;
    }
    get rosText() {
        return this._rosText;
    }
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
    async getSchedule() {
        const beginDate = this.beginDate.toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const endDate = this.endDate.toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        let id = (this.type === 'group' ? this.groupId : this.type === 'teacher' ? this.teacherId : this.roomId);
        if (!id)
            id = '';
        let name = (this.type === 'group' ? this.group : this.type === 'teacher' ? this.teacher : this.room);
        name = this.encodeCP1251(name);
        const response = await fetch(`https://dekanat.zu.edu.ua/cgi-bin/timetable_export.cgi?req_type=rozklad&req_mode=${this.type}&OBJ_ID=${id}&OBJ_name=${name}&dep_name=&begin_date=${beginDate}&end_date=${endDate}&ros_text=${this.rosText ? 'separated' : 'united'}${this.showEmpty ? '' : '&show_empty=yes'}${this.allStreamComponents ? '' : '&all_stream_components=yes'}&req_format=json&coding_mode=UTF8&bs=%D1%F4%EE%F0%EC%F3%E2%E0%F2%E8+%E7%E0%EF%E8%F2`);
        if (!response.ok)
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        const data = await response.json();
        if (data.psrozklad_export.code !== '0') {
            throw new Error(JSON.stringify(data.psrozklad_export.error) || "Unknown error");
        }
        return data.psrozklad_export.roz_items;
    }
    encodeCP1251(str) {
        const buf = iconv.encode(str, 'win1251');
        return Array.from(buf).map(b => '%' + b.toString(16).toUpperCase().padStart(2, '0')).join('');
    }
}
