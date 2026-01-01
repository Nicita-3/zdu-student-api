import fetch from 'cross-fetch';
import iconv from 'iconv-lite';
import { AcademicGroups } from './types.js';
import { generateCookieString, isLoginPage } from '../cabinet/session.js';
import { parseGroupsPage } from '../cabinet/parsers.js';

/**
 * Отримати всі академічні групи
 * @category CabinetTeacher
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
 * @returns Об'єкт академічних груп {@link AcademicGroups}
 */
export async function getAcademicGroups(sesId: string, sessGUID: string): Promise<AcademicGroups> {
    try {
        let result: AcademicGroups = { ok: false, groups: [] };
        const cookieString = generateCookieString(sessGUID);
        const response1 = await fetch(
            `https://dekanat.zu.edu.ua/cgi-bin/kaf.cgi?half=0&sesID=${sesId}&n=2&action=groups`,
            { headers: { Cookie: cookieString } },
        );
        const buffer1 = await response1.arrayBuffer();
        const html1 = iconv.decode(Buffer.from(buffer1), 'windows-1251');
        if (isLoginPage(html1)) return result;
        result.groups = parseGroupsPage(html1, 1);

        const response2 = await fetch(
            `https://dekanat.zu.edu.ua/cgi-bin/kaf.cgi?half=1&sesID=${sesId}&n=2&action=groups`,
            { headers: { Cookie: cookieString } },
        );
        const buffer2 = await response2.arrayBuffer();
        const html2 = iconv.decode(Buffer.from(buffer2), 'windows-1251');
        if (isLoginPage(html2)) return result;
        result.groups = [...result.groups, ...parseGroupsPage(html2, 2)];
        result.ok = true;
        return result;
    } catch (e) {
        console.error('Error in getAcademicGroups:', e);
        throw e;
    }
}
