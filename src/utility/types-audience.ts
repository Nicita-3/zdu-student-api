import { TypeAudience } from "../types.ts";
import fetch from 'cross-fetch';

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
export async function getTypesAudience(query?: string): Promise<TypeAudience[]> {
    try {
        const url = `https://dekanat.zu.edu.ua/cgi-bin/timetable_export.cgi?req_type=room_type_list&req_format=json&coding_mode=UTF8&bs=%D1%F4%EE%F0%EC%F3%E2%E0%F2%E8+%E7%E0%EF%E8%F2`;
        const response = await fetch(url);
        if (!response.ok) return [];

        let typesAudience: TypeAudience[] = (await response.json()).psrozklad_export.objects;

        if (query) {
            typesAudience = typesAudience.filter(ta => ta.full.includes(query));
        }

        return typesAudience;

    } catch (e) {
        return [];
    }
}
