import { Group } from "../types.ts";

/**
* Повертає список груп
* 
* @param query - Рядок пошуку групи
* @returns Масив груп
* 
* Приклад використання
* ```ts
* console.log((await getGroups('23Бд-СОінф')));
* ```
*
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
export async function getGroups(query?: string): Promise<Group[]> {
    try {
        const url = `https://dekanat.zu.edu.ua/cgi-bin/timetable_export.cgi?req_type=obj_list&req_mode=group&show_ID=yes&req_format=json&coding_mode=UTF8&bs=%D1%F4%EE%F0%EC%F3%E2%E0%F2%E8+%E7%E0%EF%E8%F2`;
        const response = await fetch(url);
        if (!response.ok) return [];
        const data = await response.json();
        let groups: Group[] = data.psrozklad_export.departments.flatMap(
            (dept: { name: string; objects: { name: string; ID: string }[] }) =>
                dept.objects.map(
                    (obj: { name: string; ID: string }) => ({
                        name: obj.name,
                        id: obj.ID,
                        faculty: dept.name
                    })
                )
        );
        if (query) {
            groups = groups.filter(g => g.name.includes(query));
        }
        return groups;
    } catch (e) {
        return [];
    }
}