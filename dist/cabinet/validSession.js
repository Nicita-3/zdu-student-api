import fetch from 'cross-fetch';
import iconv from 'iconv-lite';
import { generateCookieString, isLoginPage } from './utils.js';
/**
 * Перевірка на валідність сесії
 * @category Cabinet
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @returns boolean значення.
 */
export async function isValidSession(sesId, sessGUID) {
    try {
        const cookieString = generateCookieString(sessGUID);
        const response = await fetch(`https://dekanat.zu.edu.ua/cgi-bin/classman.cgi?n=3&sesID=${sesId}`, {
            headers: {
                Cookie: cookieString,
            },
        });
        const buffer = await response.arrayBuffer();
        const html = iconv.decode(Buffer.from(buffer), 'windows-1251');
        if (!isLoginPage(html)) {
            return true;
        }
        return false;
    }
    catch {
        return false;
    }
}
