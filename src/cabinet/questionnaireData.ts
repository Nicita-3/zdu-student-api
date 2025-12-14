import fetch from 'cross-fetch';
import iconv from 'iconv-lite';
import { QuestionnaireData } from './types.js';
import { parseQuestionnairePageN3, parseQuestionnairePageN31 } from './parsers.js';
import { generateCookieString, isLoginPage } from './utils.js';

/**
 * Отримати анкетні дані студента
 * @category Cabinet
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @example
 * ```typescript
 * const data = await getQuestionnaireData(sesId, sessGUID);
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
 * @returns Об'єкт з запарсеними даними {@link QuestionnaireData}
 */
export async function getQuestionnaireData(
    sesId: string,
    sessGUID: string,
): Promise<QuestionnaireData> {
    try {
        const result: QuestionnaireData = { ok: false };
        const cookieString = generateCookieString(sessGUID);
        const response1 = await fetch(
            `https://dekanat.zu.edu.ua/cgi-bin/classman.cgi?n=31&sesID=${sesId}`,
            {
                headers: {
                    Cookie: cookieString,
                },
            },
        );

        const buffer1 = await response1.arrayBuffer();
        const html1 = iconv.decode(Buffer.from(buffer1), 'windows-1251');
        if (isLoginPage(html1)) return { ok: false };
        const data1 = parseQuestionnairePageN31(html1);
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
            const data2 = parseQuestionnairePageN3(html2);
            Object.assign(result, data2);
        }
        result.ok = true;
        return result;
    } catch (e) {
        console.error('Error in getQuestionnaireData:', e);
        throw e;
    }
}
