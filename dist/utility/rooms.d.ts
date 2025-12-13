import { Room } from "../types.ts";
/**
* Повертає список аудиторій
* @category Utility
*
* @param query - Рядок пошуку аудиторії
* @returns Масив аудиторій
*
* @example
* ```ts
* console.log((await getRooms('319')));
* ```
*
* @remarks
* Виведе:
* ```JSON
* [
*   { name: '319/№1', id: '35', block: '№1' },
*   { name: '319/№3', id: '270', block: '№3' }
* ]
* ```
*/
export declare function getRooms(query?: string): Promise<Room[]>;
