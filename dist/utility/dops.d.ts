import { Dop } from "../types.js";
/**
* Повертає список доп. обладнання аудиторій
* @category Utility
*
* @param query - Рядок пошуку доп. обладнання
* @returns Масив доп. обладнання
*
* @deprecated Ця функція не використовується і повертає безкорисливі данні.
*
* @example
* ```ts
* console.log((await getDops()));
* ```
*
* @remarks
* Виведе:
* ```JSON
* [
*   {
*       name: 'Не використовується',
*       ...
*   }
* ]
* ```
*/
export declare function getDops(query?: string): Promise<Dop[]>;
