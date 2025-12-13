import fetch from 'cross-fetch';
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
export async function getDops(query) {
    try {
        const url = `https://dekanat.zu.edu.ua/cgi-bin/timetable_export.cgi?req_type=room_dop_list&req_format=json&coding_mode=UTF8&bs=%D1%F4%EE%F0%EC%F3%E2%E0%F2%E8+%E7%E0%EF%E8%F2`;
        const response = await fetch(url);
        if (!response.ok)
            return [];
        const text = await response.text();
        const fixed = fixBrokenJson(text);
        const data = JSON.parse(fixed);
        let dops = data.psrozklad_export.IDs;
        if (query) {
            dops = dops.filter(dop => dop.name.includes(query));
        }
        return dops;
    }
    catch (e) {
        return [];
    }
}
function fixBrokenJson(input) {
    let s = input.replace(/,\s*(?=[}\]])/g, "")
        .replace(/(?<=\[\s*),/g, "")
        .replace(/,,+/g, ",")
        .replace(/\[\s*,\s*{/g, "[{")
        .replace(/}]+(?=\s*,\s*"code")/g, "}");
    const firstValidEnd = s.indexOf('}}');
    if (firstValidEnd !== -1) {
        s = s.slice(0, firstValidEnd + 1);
    }
    const lastBrace = s.lastIndexOf("}");
    if (lastBrace !== -1) {
        s = s.slice(0, lastBrace + 1);
    }
    return s;
}
