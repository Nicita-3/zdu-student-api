import fetch from 'cross-fetch';
import iconv from 'iconv-lite';
import { Disciplines } from './types.js';
import { parseDisciplinesPageN6, parseDisciplinesPageN7 } from './parsers.js';
import { generateCookieString, isLoginPage } from './utils.js';

/**
 * Отримати всі дисципліни студента
 * @category Cabinet
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
 * @returns Масив дисциплін {@link Disciplines}
 */
export async function getDisciplines(sesId: string, sessGUID: string): Promise<Disciplines> {
    try {
        const result: Disciplines = { ok: false, disciplines: [] };
        const cookieString = generateCookieString(sessGUID);
        const response1 = await fetch(
            `https://dekanat.zu.edu.ua/cgi-bin/classman.cgi?n=3&sesID=${sesId}`,
            { headers: { Cookie: cookieString } },
        );

        const buffer1 = await response1.arrayBuffer();
        const html1 = iconv.decode(Buffer.from(buffer1), 'windows-1251');
        if (isLoginPage(html1)) return result;
        let data: string | undefined = extractStrongValue(html1, 'Семестрові бали');
        if (data === undefined) return result;
        const response2 = await fetch(`https://dekanat.zu.edu.ua/cgi-bin/${data.slice(2)}`, {
            headers: { Cookie: cookieString },
        });

        const buffer2 = await response2.arrayBuffer();
        const html2 = iconv.decode(Buffer.from(buffer2), 'windows-1251');
        if (isLoginPage(html2)) return result;
        result.disciplines = parseDisciplinesPageN6(html2);
        result.ok = true;
        return result;
    } catch (e) {
        console.error('Error in getDisciplines:', e);
        throw e;
    }
}

/**
 * Витягує значення з HTML після label до кінця li тегу
 */
function extractStrongValue(html: string, label: string): string | undefined {
    const textIdx = html.indexOf(label);
    if (textIdx === -1) return undefined;

    const liStart = html.lastIndexOf('<li', textIdx);
    if (liStart === -1) return undefined;

    const liEnd = html.indexOf('</li>', textIdx);
    if (liEnd === -1) return undefined;

    const liContent = html.substring(liStart, liEnd);

    const hrefMatch = liContent.match(/href\s*=\s*["']([^"']+)["']/i);
    if (!hrefMatch) return undefined;

    const href = hrefMatch[1].trim();
    return href || undefined;
}

/**
 * Отримати поточні дисципліни студента
 * @category Cabinet
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
 * @returns Масив дисциплін {@link Disciplines}
 */
export async function getСurrentDisciplines(sesId: string, sessGUID: string): Promise<Disciplines> {
    try {
        const result: Disciplines = { ok: false, disciplines: [] };
        const cookieString = generateCookieString(sessGUID);
        const response1 = await fetch(
            `https://dekanat.zu.edu.ua/cgi-bin/classman.cgi?n=7&sesID=${sesId}`,
            { headers: { Cookie: cookieString } },
        );

        const buffer1 = await response1.arrayBuffer();
        const html1 = iconv.decode(Buffer.from(buffer1), 'windows-1251');

        if (isLoginPage(html1)) return result;
        result.disciplines = parseDisciplinesPageN7(html1);
        //console.log(html1);
        result.ok = true;
        return result;
    } catch (e) {
        console.error('Error in getСurrentDisciplines:', e);
        throw e;
    }
}
