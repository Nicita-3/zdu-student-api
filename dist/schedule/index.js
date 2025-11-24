import iconv from 'iconv-lite';
import fetch from 'node-fetch';
import { Buffer } from 'buffer';
import { faculties } from "../constants";
/**
 * Клас розкладу
 */
export class Schedule {
    /**
    * Група
    */
    group = '';
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
    faculty = faculties.none;
    /**
    * Викладач
    */
    teacher = '';
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
        // Якщо rosText = false, блокувати allStreamComponents
        if (!value) {
            this.allStreamComponents = false;
        }
    }
    get rosText() {
        return this._rosText;
    }
    constructor() {
    }
    /**
    * Повертає список груп
    */
    async getGroups() {
        const url = 'https://dekanat.zu.edu.ua/cgi-bin/groups.cgi'; // приклад
        const response = await fetch(url);
        const buffer = await response.arrayBuffer(); // отримуємо raw data
        const text = iconv.decode(Buffer.from(buffer), 'windows-1251'); // конвертуємо в UTF-8
        // Тут треба парсити текст і витягувати групи, наприклад через регулярки
        const groups = text.match(/<option value=".*?">(.*?)<\/option>/g)?.map(opt => opt.replace(/<.*?>/g, '').trim()) || [];
        return groups;
    }
    /**
    * Повертає список викладачів
    */
    async getTeachers() {
        const url = 'https://dekanat.zu.edu.ua/cgi-bin/teachers.cgi';
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const text = iconv.decode(Buffer.from(buffer), 'windows-1251');
        const teachers = text.match(/<option value=".*?">(.*?)<\/option>/g)?.map(opt => opt.replace(/<.*?>/g, '').trim()) || [];
        return teachers;
    }
    async getSchedule() {
        const url = `https://dekanat.zu.edu.ua/cgi-bin/timetable_export.cgi?group=${this.group}&faculty=${this.faculty.id}`;
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const text = iconv.decode(Buffer.from(buffer), 'windows-1251');
        // Тут треба парсити HTML/JSON розкладу
        return text;
    }
}
