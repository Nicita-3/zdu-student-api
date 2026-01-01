import { Discipline, DataStudent } from '../cabinetStudent/types.js';
import { DataTeacher, AcademicGroup } from '../cabinetTeacher/types.js';

/**
 * Парсить дані з сторінки n=31 (анкетні дані)
 */
export function parseDataPageN31(html: string): Partial<DataStudent> {
    const data: Partial<DataStudent> = {};
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
export function parseDataPageN3(html: string): Partial<DataStudent> {
    const data: Partial<DataStudent> = {};
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

/**
 * Парсить сторінку "Семестрові бали" (n=6) і повертає список дисциплін
 */
export function parseDisciplinesPageN6(html: string): Discipline[] {
    const result: Discipline[] = [];
    const rowRegex =
        /<tr>\s*<td>([^<]+)<\/td>\s*<td>\d+<\/td>\s*<td>[\s\S]*?<a[^>]+href="[^"]*prID=(\d+)[^"]*"[\s\S]*?<\/a>[\s\S]*?<\/td>\s*<\/tr>/gi;

    let match: RegExpExecArray | null;

    while ((match = rowRegex.exec(html)) !== null) {
        const name = match[1].trim();
        const prId = match[2].trim();

        if (name && prId) {
            result.push({ name, prId });
        }
    }

    return result;
}

/**
 * Парсить HTML і повертає масив дисциплін (n=7)
 * @param html - HTML сторінки з select[id="prt"]
 */
export function parseDisciplinesPageN7(html: string): Discipline[] {
    const disciplines: Discipline[] = [];
    const optionRegex = /<option\s+value="(\d+)">([\s\S]*?)<\/option>/g;
    let match: RegExpExecArray | null;

    while ((match = optionRegex.exec(html)) !== null) {
        const value = match[1];
        const name = match[2].trim();
        if (value !== '-1') {
            disciplines.push({ prId: value, name });
        }
    }

    return disciplines;
}

/**
 * Парсить головну сторінку кабінету викладача
 * @param html - HTML сторінки кабінету викладача
 * @returns Дані викладача
 */
export function parseTeacherData(html: string): DataTeacher {
    const data: DataTeacher = { ok: false };

    try {
        const fullName = extractTeacherFullName(html);
        if (fullName) {
            data.fullName = fullName;
            const nameParts = parseFullName(fullName);
            Object.assign(data, nameParts);
        }
        data.department = extractDepartment(html);
        data.partTimeHours = extractHoursValue(
            html,
            /за сумісництвом\s*:\s*<strong>[^0-9]*\((\d+)[^)]*\)<\/strong>/,
        );
        data.workDurationMonths = extractNumericValue(
            html,
            /Тривалість роботи в навч\. році \(місяців\):\s*<strong>(\d+)<\/strong>/,
        );
        data.totalPositionHours = extractHoursValue(
            html,
            /загалом\s*<strong>(\d+)\s*год\.<\/strong>\s*за ставками/,
        );
        data.workloadByStaff = extractHoursValue(
            html,
            /за штатом\s*-\s*<strong>(\d+)\s*год\.<\/strong>/,
        );
        const workloadSectionIndex = html.indexOf('Розподілене навчальне навантаження:');
        if (workloadSectionIndex !== -1) {
            const workloadSection = html.substring(workloadSectionIndex);
            data.totalWorkload = extractHoursValue(
                workloadSection,
                /загалом\s*<strong>(\d+)\s*год\.<\/strong>/,
            );
        }

        data.ok = true;
    } catch (error) {
        data.ok = false;
    }

    return data;
}

/**
 * Витягує повне ім'я викладача з h2 тегу
 */
function extractTeacherFullName(html: string): string | undefined {
    const h2Match = html.match(/<h2>Викладач:\s*([^<]+)<\/h2>/);
    if (!h2Match) return undefined;
    return h2Match[1].trim();
}

/**
 * Витягує назву кафедри з h3 тегу
 */
function extractDepartment(html: string): string | undefined {
    const h3Match = html.match(/<h3>Кафедра:\s*([^<]+)<\/h3>/);
    if (!h3Match) return undefined;
    return h3Match[1].trim();
}

/**
 * Витягує числове значення годин за регулярним виразом
 */
function extractHoursValue(html: string, regex: RegExp): number | undefined {
    const match = html.match(regex);
    if (!match) return undefined;
    const value = parseInt(match[1], 10);
    return isNaN(value) ? undefined : value;
}

/**
 * Витягує числове значення за регулярним виразом
 */
function extractNumericValue(html: string, regex: RegExp): number | undefined {
    const match = html.match(regex);
    if (!match) return undefined;
    const value = parseInt(match[1], 10);
    return isNaN(value) ? undefined : value;
}

/**
 * Парсить сторінку зі списком академічних груп викладача
 * @param html - HTML сторінки "Академічні групи"
 * @returns Список груп викладача
 */
export function parseGroupsPage(html: string, semester: number): AcademicGroup[] {
    try {
        const groups: AcademicGroup[] = [];
        const rowRegex =
            /<tr><td><a[^>]+href="\.\/teachers\.cgi\?sesID=[^"]+&n=1&grp=([^"&]+)&teacher=(\d+)"[^>]*>([^<]+)<\/a><\/td><td[^>]*>(\d+)<\/td><td>([^<]+?)<br\s*\/>\s*<em>([^<]+)<\/em><\/td><\/tr>/gi;

        let match: RegExpExecArray | null;

        while ((match = rowRegex.exec(html)) !== null) {
            const encodedName = match[1].trim();
            const teacherId = match[2].trim();
            const name = match[3].trim();
            const course = parseInt(match[4].trim(), 10);
            const specialty = match[5].trim();
            const faculty = match[6].trim();

            // Формуємо повний URL журналу
            const journalUrl = `./teachers.cgi?sesID={sesID}&n=1&grp=${encodedName}&teacher=${teacherId}`;

            groups.push({
                name,
                semester,
                encodedName,
                course,
                specialty,
                faculty,
                teacherId,
                journalUrl,
            });
        }

        return groups;
    } catch {
        return [];
    }
}

/**
 * Декодує назву групи з URL-encoded формату
 * @param encodedName - URL-encoded назва групи
 * @returns Декодована назва групи
 */
export function decodeGroupName(encodedName: string): string {
    try {
        return decodeURIComponent(encodedName);
    } catch (error) {
        return encodedName;
    }
}
