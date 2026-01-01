import fetch from 'cross-fetch';
import iconv from 'iconv-lite';
/**
 * Отримати sesID та sessGUID користувача
 * @category Cabinet
 * @param login - Прізвище користувача
 * @param password - Пароль
 * @param type - тип кабінету 'student' | 'teacher'
 * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
 * @returns Об'єкт { sesID, sessGUID }
 */
export async function getSesId(login, password, type) {
    try {
        const urlStudent = 'https://dekanat.zu.edu.ua/cgi-bin/classman.cgi?n=1&ts=16161';
        const urlTeacher = 'https://dekanat.zu.edu.ua/cgi-bin/kaf.cgi?n=1&ts=28888';
        const formData = `user_name=${login}&user_pwd=${password}${type == 'student' ? '&n=1&rout=&t=16161' : '&n=1&rout=&t=1'}`;
        const encodedFormData = iconv.encode(formData, 'windows-1251');
        const response = await fetch(type == 'student' ? urlStudent : urlTeacher, {
            method: 'POST',
            body: new Uint8Array(encodedFormData),
            redirect: 'manual',
        });
        if (response.status === 302) {
            const buffer = await response.arrayBuffer();
            const responseText = iconv.decode(Buffer.from(buffer), 'utf-8');
            const cookies = response.headers.get('set-cookie');
            let sessGUID = '';
            if (cookies) {
                const sessGUIDStart = cookies.indexOf('SessGUID=') + 'SessGUID='.length;
                const sessGUIDEnd = cookies.indexOf(';', sessGUIDStart);
                sessGUID = cookies.substring(sessGUIDStart, sessGUIDEnd);
            }
            const sesIDIndex = responseText.indexOf('sesID=') + 6;
            const sesID = responseText.substring(sesIDIndex, sesIDIndex + 36);
            return { ok: true, sesID, sessGUID };
        }
        return { ok: false, sesID: '', sessGUID: '' };
    }
    catch (e) {
        console.error('Error in getSesID:', e);
        throw e;
    }
}
/**
 * Перевірка на валідність сесії
 * @category Cabinet
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @param type - тип кабінету 'student' | 'teacher'
 * @returns boolean значення.
 */
export async function isValidSession(sesId, sessGUID, type) {
    const urlStudent = 'https://dekanat.zu.edu.ua/cgi-bin/classman.cgi?n=3&sesID=';
    const urlTeacher = 'https://dekanat.zu.edu.ua/cgi-bin/kaf.cgi?n=2&sesID=';
    try {
        const cookieString = generateCookieString(sessGUID);
        const response = await fetch(`${type == 'student' ? urlStudent : urlTeacher}${sesId}`, {
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
/**
 * Генерує cookie строку з DateTime та SessGUID
 * @category Cabinet
 * @param sessGUID - GUID сесії з cookie
 * @returns cookie рядок
 */
export function generateCookieString(sessGUID) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const dateTime = `${day}.${month}.${year}+${hours}%3A${minutes}%3A${seconds}`;
    return `DateTime=${dateTime}; SessGUID=${sessGUID}`;
}
/**
 * Перевірка чи є отримана сторінка сторінкою авторизації
 * @category Cabinet
 * @returns true | false
 */
export function isLoginPage(html) {
    return (html.includes('Авторизація користувача') ||
        html.includes('user_name') ||
        html.includes('Недійсний ідентифікатор сесії користувача'));
}
