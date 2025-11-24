import iconv from 'iconv-lite';
import fetch from 'node-fetch';
import { Buffer } from 'buffer';
import { faculties } from '../constants.ts';
import { Faculty, ScheduleTypes } from '../types.ts';

/**
 * Клас розкладу
 */
export class Schedule {
    /**
    * Посилання на розклад
    */
    private url: string = 'https://dekanat.zu.edu.ua/cgi-bin';

    /**
    * Тип розкладу.
    *
    * Типи: group, teacher, room.
    */
    public type: ScheduleTypes = 'group';

    /**
    * Група
    */
    public group: string = '';

    /**
    * Id групи
    */
    public groupId?: number;

    /**
    * Викладач
    */
    public teacher: string = '';

    /**
    * Id викладача
    */
    public teacherId?: number;

    /**
    * Аудиторія
    */
    public room: string = '';

    /**
    * Id аудиторії
    */
    public roomId?: number;

    /**
     * Факультет.
     * 
     * Можна призначити одну з констант з `faculties`, наприклад:
     * ```ts
     * schedule.faculty = faculties.physicsMath;
     * console.log(schedule.faculty.id);   // 1001
     * console.log(schedule.faculty.name); // 'Фізико-математичний факультет'
     * ```
     */
    public faculty: Faculty = faculties.none;

    /**
    * Курс
    * 
    * `0` - не вибрано
    */
    public course: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0;

    /**
    * Початкова дата розкладу
    */
    public beginDate: Date = new Date();

    /**
    * Кінцева дата розкладу (за промовчанням +7 днів)
    */
    public endDate: Date = new Date(this.beginDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    /**
    * Показувати пусті дні - false
    */
    public showEmpty: boolean = false;

    /**
     * false - сформований текст (за промовчанням)
     * true - окремі стовпчики
     */
    private _rosText: boolean = false;

    /**
     * Показувати повний склад потоку (тільки для rosText=true)
     */
    public allStreamComponents: boolean = false;

    public set rosText(value: boolean) {
        this._rosText = value;
        if (!value) this.allStreamComponents = false;
    }

    public get rosText(): boolean {
        return this._rosText;
    }

    public async getSchedule() {
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
        let id: number | string | undefined = (this.type === 'group' ? this.groupId : this.type === 'teacher' ? this.teacherId : this.roomId);
        if (!id) id = '';
        let name: string = (this.type === 'group' ? this.group : this.type === 'teacher' ? this.teacher : this.room);
        name = this._encodeCP1251(name);

        const response = await fetch(`https://dekanat.zu.edu.ua/cgi-bin/timetable_export.cgi?req_type=rozklad&req_mode=${this.type}&OBJ_ID=${id}&OBJ_name=${name}&dep_name=&begin_date=${beginDate}&end_date=${endDate}&ros_text=${this.rosText ? 'separated' : 'united'}${this.showEmpty ? '' : '&show_empty=yes'}${this.allStreamComponents ? '' : '&all_stream_components=yes'}&req_format=json&coding_mode=UTF8&bs=%D1%F4%EE%F0%EC%F3%E2%E0%F2%E8+%E7%E0%EF%E8%F2`);
        if (!response.ok) return [];
        const data: any = await response.json();
        if (data.psrozklad_export.code == 0) return data.psrozklad_export.roz_items; // бажано зробити що б повертало текст і код помилки.
        return []
    }

    private _encodeCP1251(str: string) {
        const buf = iconv.encode(str, 'win1251');
        return Array.from(buf)
            .map(b => '%' + b.toString(16).toUpperCase().padStart(2, '0'))
            .join('');
    }
}
