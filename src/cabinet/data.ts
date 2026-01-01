import fetch from 'cross-fetch';
import iconv from 'iconv-lite';
import { DataTeacher } from '../cabinetTeacher/types.js';
import { generateCookieString, isLoginPage } from './session.js';
import { parseDataPageN3, parseDataPageN31, parseTeacherData } from './parsers.js';
import { DataStudent } from '../cabinetStudent/types.js';

/**
 * Отримати анкетні дані студента
 * @category CabinetTeacher
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
 * @example
 * ```typescript
 * const cb = new CabinetTeacher(process.env.LOGINTEACHER!, process.env.PASSWORDTEACHER!);
 * const data = await cb.getData(sesId, sessGUID);
 * // {
 *       ok: true,
 *       fullName: 'Іванов Іван Іванович',
 *       lastName: 'Іванов',
 *       firstName: 'Іван',
 *       middleName: 'Іванович',
 *       department: 'Кафедра комп’ютерних наук та інформаційних технологій',
 *       partTimeHours: 0,
 *       workDurationMonths: 10,
 *       totalPositionHours: 0,
 *       workloadByStaff: 68,
 *       totalWorkload: 68
 * // }
 * ```
 * @returns Об'єкт з запарсеними даними {@link DataTeacher}
 */
export async function getDataTeacher(sesId: string, sessGUID: string): Promise<DataTeacher> {
    try {
        const result: DataTeacher = { ok: false };
        const cookieString = generateCookieString(sessGUID);
        const response1 = await fetch(
            `https://dekanat.zu.edu.ua/cgi-bin/kaf.cgi?n=2&sesID=${sesId}`,
            { headers: { Cookie: cookieString } },
        );

        const buffer = await response1.arrayBuffer();
        const html = iconv.decode(Buffer.from(buffer), 'windows-1251');
        if (isLoginPage(html)) return { ok: false };
        const data = parseTeacherData(html);
        Object.assign(result, data);
        result.ok = true;
        return result;
    } catch (e) {
        console.error('Error in getDataTeacher:', e);
        throw e;
    }
}

/**
 * Отримати анкетні дані студента
 * @category CabinetStudent
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
 * @example
 * ```typescript
 * const cb = new CabinetTeacher(process.env.LOGINSTUDENT!, process.env.PASSWORDSTUDENT!);
 * const data = await cb.getData(sesId, sessGUID);
 * // {
 * //   ok: true,
 * //   fullName: 'Іванов Іван Іванович',
 * //   lastName: 'Іванов',
 * //   firstName: 'Іван',
 * //   middleName: 'Іванович',
 * //   birthDate: 'хх.хх.хххх',
 * //   gender: 'Чол',
 * //   country: 'УКРАЇНА',
 * //   email: 'student@example.com',
 * //   phones: ['+380(99)-123-45-67'],
 * //   faculty: 'Фізико-математичний факультет',
 * //   specialty: 'Середня освіта',
 * //   degree: 'бакалавр',
 * //   group: '23Бд-СОінф',
 * //   studyForm: 'Денна',
 * //   paymentForm: 'Держ.замовлення',
 * //   enrollmentOrder: 'ххх-К(ОС)',
 * //   enrollmentDate: 'хх.хх.2024',
 * //   studyDuration: '4 роки',
 * //   graduationDate: 'хх.хх.2028'
 * //   ...інші
 * // }
 * ```
 * @returns Об'єкт з запарсеними даними {@link Data}
 */
export async function getDataStudent(sesId: string, sessGUID: string): Promise<DataStudent> {
    try {
        const result: DataStudent = { ok: false };
        const cookieString = generateCookieString(sessGUID);
        const response1 = await fetch(
            `https://dekanat.zu.edu.ua/cgi-bin/classman.cgi?n=31&sesID=${sesId}`,
            { headers: { Cookie: cookieString } },
        );

        const buffer1 = await response1.arrayBuffer();
        const html1 = iconv.decode(Buffer.from(buffer1), 'windows-1251');
        if (isLoginPage(html1)) return { ok: false };
        const data1 = parseDataPageN31(html1);
        Object.assign(result, data1);
        const response2 = await fetch(
            `https://dekanat.zu.edu.ua/cgi-bin/classman.cgi?n=3&sesID=${sesId}`,
            {
                headers: {
                    Cookie: cookieString,
                },
            },
        );

        const buffer2 = await response2.arrayBuffer();
        const html2 = iconv.decode(Buffer.from(buffer2), 'windows-1251');
        if (!isLoginPage(html2)) {
            const data2 = parseDataPageN3(html2);
            Object.assign(result, data2);
        }
        result.ok = true;
        return result;
    } catch (e) {
        console.error('Error in getDataStudent:', e);
        throw e;
    }
}
