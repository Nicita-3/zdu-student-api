import fetch from 'cross-fetch';
import iconv from 'iconv-lite';
import { generateCookieString, isLoginPage } from '../cabinet/session.js';
import { Buffer } from 'buffer';
/**
 * Отримати оцінки поточного студента з вибраного предмета
 * @category CabinetStudent
 * @remarks
 * Журнал показує лише оцінки студента, який переглядає сторінку,
 * рядки інших студентів анонімізовані, тому вони не повертаються.
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @param prId - ID дисципліни
 * @param semester - Семестр
 * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
 * @returns Оцінки з предмета {@link Scores}
 */
export async function getScores(sesId, sessGUID, prId, semester) {
    try {
        const result = {
            ok: false,
            prId: prId,
            scheduleItem: [],
        };
        const cookieString = generateCookieString(sessGUID);
        const formData = `n=7&sesID=${sesId}&teacher=0&irc=0&tid=0&CYKLE=-1&prt=${prId}&hlf=${semester === 1 ? 0 : 1}&grade=0&m=-1`;
        const encodedFormData = iconv.encode(formData, 'windows-1251');
        const response1 = await fetch(`https://dekanat.zu.edu.ua/cgi-bin/classman.cgi?n=7&sesID=${sesId}`, {
            method: 'POST',
            body: new Uint8Array(encodedFormData),
            redirect: 'manual',
            headers: { Cookie: cookieString },
        });
        const buffer1 = await response1.arrayBuffer();
        const html1 = iconv.decode(Buffer.from(buffer1), 'windows-1251');
        if (isLoginPage(html1))
            return result;
        const columns = extractJsArray(html1, 'tableColumns');
        const rows = extractJsArray(html1, 'rowsData');
        if (columns === undefined || rows === undefined)
            return result;
        result.name = parseDisciplineName(html1, prId);
        const { items, fields } = parseSchedule(columns, html1);
        result.scheduleItem = items;
        result.studentScores = parseScores(rows, fields);
        result.ok = true;
        return result;
    }
    catch (e) {
        console.error('Error in getScores:', e);
        throw e;
    }
}
/**
 * Витягує текст JS-масиву `var name = [...];` зі сторінки журналу
 */
function extractJsArray(html, name) {
    const start = html.indexOf(`var ${name} = [`);
    if (start === -1)
        return undefined;
    const end = html.indexOf('];', start);
    if (end === -1)
        return undefined;
    return html.slice(start + `var ${name} = `.length, end + 1);
}
/**
 * Витягує назву дисципліни з вибраного option у select[id="prt"]
 */
function parseDisciplineName(html, prId) {
    const m = html.match(new RegExp(`<option\\b[^>]*value="${prId}"[^>]*>([^<]*)`));
    const name = m?.[1]
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim();
    return name || undefined;
}
/**
 * Витягує список занять з опису колонок журналу (`tableColumns`)
 * @returns Заняття та відповідні їм поля в рядку оцінок (`L0a`, `L0b`, `L6`, ...)
 */
function parseSchedule(columns, html) {
    const items = [];
    const fields = [];
    const descriptions = parseDescriptions(html);
    // Кожна колонка заняття/модуля починається з заголовка у <span style="white-space:nowrap;">
    const groups = columns.split(`{title:'<span style="white-space:nowrap;">`).slice(1);
    for (const group of groups) {
        const groupFields = [...group.matchAll(/field:'(L\d+[ab]?)'/g)].map((m) => m[1]);
        if (!groupFields.length)
            continue;
        const moduleMatch = group.match(/^(М\d+)<\/span>/);
        if (moduleMatch) {
            const moduleNum = moduleMatch[1];
            items.push({
                teacher: undefined,
                date: undefined,
                type: 'МД',
                time: '',
                index: `module_${moduleNum}`,
                description: `Модуль ${moduleNum}`,
            });
            fields.push(groupFields);
            continue;
        }
        const headMatch = group.match(/data-ind="(\d+)" data-head="([^"]*)"/);
        if (!headMatch)
            continue;
        const index = headMatch[1];
        const [date = '', type = ''] = headMatch[2].split(/\s+/);
        const time = group.match(/<br>\s*(\d{2}:\d{2}-\d{2}:\d{2})/)?.[1] ?? '';
        const tooltip = group.match(/headerTooltip:'([^']*)'/)?.[1] ?? '';
        const teacher = tooltip.split(',')[0].trim();
        items.push({ teacher, date, type, time, index, description: descriptions.get(index) });
        fields.push(groupFields);
    }
    return { items, fields };
}
/**
 * Витягує описи занять з HTML (`<div id="r{index}" class="d-none">Опис<br>...</div>`)
 */
function parseDescriptions(html) {
    const descriptions = new Map();
    const divRegex = /<div\s+id="r(\d+)"\s+class="d-none">([\s\S]*?)<\/div>/g;
    let match;
    while ((match = divRegex.exec(html)) !== null) {
        const content = match[2]
            .split(/<br\s*\/?>/)[0]
            .replace(/<[^>]+>/g, '')
            .trim();
        if (content)
            descriptions.set(match[1], content);
    }
    return descriptions;
}
/**
 * Розбирає JS-масив `rowsData` на об'єкти з рядковими значеннями
 */
function parseRows(rows) {
    const result = [];
    const pairRegex = /(\w+):(?:'((?:[^'\\]|\\.)*)'|([\w.-]+))/g;
    let current;
    let match;
    while ((match = pairRegex.exec(rows)) !== null) {
        const key = match[1];
        const value = match[2] !== undefined ? match[2].replace(/\\(.)/g, '$1') : match[3];
        if (key === 'id') {
            current = {};
            result.push(current);
        }
        if (current)
            current[key] = value;
    }
    return result;
}
/**
 * Витягує оцінки поточного студента з `rowsData`
 * @remarks Рядок поточного студента — єдиний з заповненим ПІБ (`pib`), інші анонімізовані
 */
function parseScores(rows, fields) {
    const parsed = parseRows(rows);
    const row = parsed.find((r) => r.pib?.replace(/<[^>]+>/g, '').trim()) ?? parsed[0];
    if (!row)
        return undefined;
    return {
        scores: fields.map((group) => group.map((field) => row[field] ?? '')),
        absences: Number(row.propAll || 0),
        uabsences: Number(row.propB || 0),
        finalScore: row.sumAll ?? '',
    };
}
