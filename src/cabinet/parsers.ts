import { QuestionnaireData } from './types';

/**
 * Парсить дані з сторінки n=31 (анкетні дані)
 */
export function parseQuestionnairePageN31(html: string): Partial<QuestionnaireData> {
    const data: Partial<QuestionnaireData> = {};
    const fullName = extractFullName(html);
    if (fullName) {
        data.fullName = fullName;
        const nameParts = parseFullName(fullName);
        Object.assign(data, nameParts);
    }

    data.birthDate = extractStrongValue(html, 'Дата народження');
    data.gender = extractStrongValue(html, 'Стать');
    data.previousFullName = extractStrongValue(html, 'Попереднє ПІБ студента');
    data.country = extractStrongValue(html, 'Країна, з якої навчається студент');
    data.lastNameEng = extractStrongValue(html, 'Прізвище англ.');
    data.firstNameEng = extractStrongValue(html, 'Ім`я англ.');
    data.middleNameEng = extractStrongValue(html, 'По батькові англ.');
    data.email = extractStrongValue(html, 'E-mail:');

    const phonesStr = extractStrongValue(html, 'Телефон(и)');
    if (phonesStr) {
        data.phones = phonesStr
            .split(';')
            .map((p) => p.trim())
            .filter((p) => p.length > 0);
    }

    return data;
}

/**
 * Парсить дані з сторінки n=3 (загальна інформація)
 */
export function parseQuestionnairePageN3(html: string): Partial<QuestionnaireData> {
    const data: Partial<QuestionnaireData> = {};
    const extractFromParagraph = (label: string): string | undefined => {
        const labelIdx = html.indexOf(label);
        if (labelIdx === -1) return undefined;
        const pStart = html.lastIndexOf('<p>', labelIdx);
        if (pStart === -1) return undefined;
        const pEnd = html.indexOf('</p>', labelIdx);
        if (pEnd === -1) return undefined;
        const pContent = html.substring(pStart, pEnd);
        const strongMatch = pContent.match(/<strong>([^<]+)<\/strong>/);
        if (!strongMatch) return undefined;
        const value = strongMatch[1].trim();
        return value.length > 0 ? value : undefined;
    };
    data.faculty = extractFromParagraph('Факультет');
    const specialtyPIdx = html.indexOf('Спеціальність');
    if (specialtyPIdx !== -1) {
        const pStart = html.lastIndexOf('<p>', specialtyPIdx);
        const pEnd = html.indexOf('</p>', specialtyPIdx);
        if (pStart !== -1 && pEnd !== -1) {
            const pContent = html.substring(pStart, pEnd);
            const specialtyMatch =
                pContent.match(/<strong>"([^"]+)"<\/strong>/) ||
                pContent.match(/<strong>([^<]+)<\/strong>/);
            if (specialtyMatch) data.specialty = specialtyMatch[1].trim();
        }
    }

    data.degree = extractFromParagraph('Ступінь / Освітньо-професійний ступінь');
    data.group = extractFromParagraph('Группа');
    data.studyForm = extractFromParagraph('Форма навчання');
    data.paymentForm = extractFromParagraph('Форма оплати навчання');
    data.studyDuration = extractFromParagraph('Термін навчання');
    data.graduationDate = extractFromParagraph('Дата закінчення навчання');
    const orderIdx = html.indexOf('Наказ на зарахування');
    if (orderIdx !== -1) {
        const pStart = html.lastIndexOf('<p>', orderIdx);
        const pEnd = html.indexOf('</p>', orderIdx);
        if (pStart !== -1 && pEnd !== -1) {
            const pContent = html.substring(pStart, pEnd);
            const orderMatch = pContent.match(
                /Наказ на зарахування\s+<strong>([^<]+)<\/strong>\s+від\s+<strong>([^<]+)<\/strong>/,
            );
            if (orderMatch) {
                data.enrollmentOrder = orderMatch[1].trim();
                data.enrollmentDate = orderMatch[2].trim();
            }
        }
    }

    return data;
}

/**
 * Витягує значення з HTML після label до кінця li тегу
 */
function extractStrongValue(html: string, label: string): string | undefined {
    const labelIdx = html.indexOf(label);
    if (labelIdx === -1) return undefined;
    const liStart = html.lastIndexOf('<li>', labelIdx);
    if (liStart === -1) return undefined;
    const liEnd = html.indexOf('</li>', labelIdx);
    if (liEnd === -1) return undefined;
    const liContent = html.substring(liStart, liEnd);
    const strongMatch = liContent.match(/<strong>(.*?)<\/strong>/);
    if (!strongMatch) return undefined;

    const value = strongMatch[1].trim();
    return value.length > 0 ? value : undefined;
}

/**
 * Витягує повне ім'я з h3 тегу
 */
function extractFullName(html: string): string | undefined {
    const h2Idx = html.indexOf('<h2>Анкетні дані студента</h2>');
    if (h2Idx === -1) return undefined;

    const h3Match = html.substring(h2Idx).match(/<h3>([^<]+)<\/h3>/);
    if (!h3Match) return undefined;

    return h3Match[1].trim();
}

/**
 * Парсить повне ім'я на прізвище, ім'я та по батькові
 */
function parseFullName(fullName: string): {
    lastName?: string;
    firstName?: string;
    middleName?: string;
} {
    const parts = fullName.trim().split(/\s+/);

    if (parts.length === 0) return {};
    if (parts.length === 1) return { lastName: parts[0] };
    if (parts.length === 2) return { lastName: parts[0], firstName: parts[1] };

    return {
        lastName: parts[0],
        firstName: parts[1],
        middleName: parts.slice(2).join(' '),
    };
}
