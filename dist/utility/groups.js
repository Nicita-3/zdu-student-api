import fetch from 'cross-fetch';
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
export async function getGroups(query) {
    try {
        const url = `https://dekanat.zu.edu.ua/cgi-bin/timetable_export.cgi?req_type=obj_list&req_mode=group&show_ID=yes&req_format=json&coding_mode=UTF8&bs=%D1%F4%EE%F0%EC%F3%E2%E0%F2%E8+%E7%E0%EF%E8%F2`;
        const response = await fetch(url);
        if (!response.ok)
            return [];
        const data = await response.json();
        let groups = data.psrozklad_export.departments.flatMap((dept) => dept.objects.map((obj) => ({
            name: obj.name,
            id: obj.ID,
            faculty: dept.name
        })));
        if (query) {
            groups = groups.filter(g => g.name.includes(query));
        }
        return groups;
    }
    catch (e) {
        return [];
    }
}
