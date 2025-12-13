import { Room } from "../types.ts";
import fetch from 'cross-fetch';

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
export async function getRooms(query?: string): Promise<Room[]> {
    try {
        const url =
            "https://dekanat.zu.edu.ua/cgi-bin/timetable_export.cgi?req_type=obj_list&req_mode=room&show_ID=yes&req_format=json&coding_mode=UTF8&bs=%D1%F4%EE%F0%EC%F3%E2%E0%F2%E8+%E7%E0%EF%E8%F2";

        const response = await fetch(url);
        if (!response.ok) return [];

        const data = await response.json();

        const rooms: Room[] = [];

        for (const block of data.psrozklad_export.blocks) {
            for (const obj of block.objects) {
                rooms.push({
                    name: obj.name,
                    id: obj.ID,
                    block: block.name,
                });
            }
        }

        if (query && query.trim() !== "") {
            const q = query.toLowerCase();
            return rooms.filter(
                room =>
                    room.name.toLowerCase().includes(q) ||
                    room.block.toLowerCase().includes(q)
            );
        }

        return rooms;
    } catch (err) {
        return [];
    }
}
