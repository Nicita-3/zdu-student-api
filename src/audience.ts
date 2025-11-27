import iconv from 'iconv-lite';
import fetch from 'node-fetch';
import { AudienceRoom, Blocks } from './types.ts';

/**
 * Клас розкладу
 * @category Audience
 */
export class Audience {
    /**
    * Назва корпусу
    */
    public blockName?: Blocks;

    /**
    * Номер пари
    */
    public lesson: number = 1;

    /**
    * Тип аудиторій який є в даному корпусі
    */
    public roomType?: string;

    /**
    * Кількість місць не менше ніж
    */
    public size_min?: number;

    /**
    * Кількість місць не більше ніж
    */
    public size_max?: number;

    /**
    * Дата аудиторії
    */
    public roomsDate: Date = new Date();

    /**
    * Наявніть доп. обладнання типу 1, 2, 3, 4, 5, 6, 7, 8
    */
    public dops: number[] = [];

    /**
    * Повертає список аудиторій
    *
    * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
    *
    * @example
    * ```ts
    * import { Audience } from "./audience.ts";
    * const audience = new Audience();
    * try {
    *   const audiences = await audience.getAudience();
    *   console.log("Аудиторії:", audiences); // Поверне список аудиторій
    * } catch (err: any) {
    *   console.error(err.message);
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
    public async getAudience(): Promise<AudienceRoom[]> {
        const date = this.roomsDate.toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        let dops: string = '';
        this.dops.forEach(dop => {
            dops += `&dop_${dop}=yes`
        })

        const response = await fetch(`https://dekanat.zu.edu.ua/cgi-bin/timetable_export.cgi?req_type=free_rooms_list&&block_name=${this.blockName !== undefined ? this.encodeCP1251(this.blockName) : ''}&size_min=${this.size_min !== undefined ? this.size_min : ''}&size_max=${this.size_max !== undefined ? this.size_max : ''}&room_type=${this.roomType !== undefined ? this.encodeCP1251(this.roomType) : ''}&begin_date=${date}&lesson=${this.lesson}${dops}&req_format=json&coding_mode=UTF8&bs=%D1%F4%EE%F0%EC%F3%E2%E0%F2%E8+%E7%E0%EF%E8%F2`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        const data: any = await response.json();
        if (data.psrozklad_export.code !== '0') {
            throw new Error(JSON.stringify(data.psrozklad_export.error) || "Unknown error");
        }
        return data.psrozklad_export.free_rooms.rooms;
    }

    private encodeCP1251(str: string) {
        const buf = iconv.encode(str, 'win1251');
        return Array.from(buf).map(b => '%' + b.toString(16).toUpperCase().padStart(2, '0')).join('');
    }
}
