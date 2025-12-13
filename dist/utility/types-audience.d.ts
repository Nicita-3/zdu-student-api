import { TypeAudience } from "../types.js";
/**
* Повертає список типів аудиторій
* @category Utility
*
* @param query - Рядок пошуку типу
* @returns Масив типів аудиторій
*
* @example
* ```ts
* console.log((await getTypesAudience('Ле')));
* ```
*
* @remarks
* Виведе:
* ```JSON
* [
*   {
*       full: 'Лекція',
*       short: 'лек'
*   }
* ]
* ```
*/
export declare function getTypesAudience(query?: string): Promise<TypeAudience[]>;
