import { Teacher } from "../types.js";
/**
* Повертає список викладачів
* @category Utility
*
* @param query - Рядок пошуку викладача
* @returns Масив викладачів
*
* @example
* ```ts
* console.log((await getTeachers('Кривонос Олександр')));
* ```
*
* @remarks
* Виведе:
* ```JSON
* [
*   {
*       name: 'Кривонос О.М.',
*       id: '420',
*       faculty: 'Кафедра комп’ютерних наук та інформаційних технологій',
*       surname: 'Кривонос',
*       firstname: 'Олександр',
*       lastname: 'Миколайович'
*   }
* ]
* ```
*/
export declare function getTeachers(query?: string): Promise<Teacher[]>;
