import { Group } from "../types.js";
/**
* Повертає список груп
* @category Utility
*
* @param query - Рядок пошуку групи
* @returns Масив груп
*
* @example
* ```ts
* console.log((await getGroups('23Бд-СОінф')));
* ```
*
* @remarks
* Виведе:
* ```JSON
* [
*   {
*       name: '23Бд-СОінф',
*       id: '-3158',
*       faculty: 'Фізико-математичний факультет'
*   }
* ]
* ```
*/
export declare function getGroups(query?: string): Promise<Group[]>;
