import { AudienceRoom, Blocks } from './types.ts';
/**
 * Клас розкладу
 * @category Audience
 */
export declare class Audience {
    /**
    * Назва корпусу
    */
    blockName?: Blocks;
    /**
    * Номер пари
    */
    lesson: number;
    /**
    * Тип аудиторій який є в даному корпусі
    */
    roomType?: string;
    /**
    * Кількість місць не менше ніж
    */
    size_min?: number;
    /**
    * Кількість місць не більше ніж
    */
    size_max?: number;
    /**
    * Дата аудиторії
    */
    roomsDate: Date;
    /**
    * Наявніть доп. обладнання типу 1, 2, 3, 4, 5, 6, 7, 8
    */
    dops: number[];
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
    getAudience(): Promise<AudienceRoom[]>;
    private encodeCP1251;
}
