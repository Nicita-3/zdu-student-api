import fetch from 'cross-fetch';
import iconv from 'iconv-lite';
import { Disciplines, ScheduleItem, Scores, StudentScores } from './types.js';
import { generateCookieString, isLoginPage } from '../cabinet/session.js';

/**
 * Отримати оцінки вибраного предмета студента
 * @category CabinetStudent
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @param prId - ID дисципліни
 * @param semester - Семестр
 * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
 * @returns Масив дисциплін {@link Disciplines}
 */
export async function getScores(
    sesId: string,
    sessGUID: string,
    prId: string,
    semester: 1 | 2,
): Promise<Scores> {
    try {
        const result: Scores = {
            ok: false,
            prId: prId,
            studentId: '',
            scheduleItem: [],
            studentScores: [],
        };
        const cookieString = generateCookieString(sessGUID);
        const formData = `n=7&sesID=${sesId}&teacher=0&irc=0&tid=0&CYKLE=-1&prt=${prId}&hlf=${semester === 1 ? 0 : 1}&grade=0&m=-1`;
        const encodedFormData = iconv.encode(formData, 'windows-1251');
        const response1 = await fetch(
            `https://dekanat.zu.edu.ua/cgi-bin/classman.cgi?n=7&sesID=${sesId}`,
            {
                method: 'POST',
                body: new Uint8Array(encodedFormData),
                redirect: 'manual',
                headers: { Cookie: cookieString },
            },
        );
        const buffer1 = await response1.arrayBuffer();
        let html1 = iconv.decode(Buffer.from(buffer1), 'windows-1251');
        if (isLoginPage(html1)) return result;
        result.scheduleItem = parseSchedule(html1);
        result.studentScores = parseScores(html1, result.scheduleItem.length);
        result.studentId = result.studentScores[0]?.id;
        if (result.studentScores.length > 1) {
            result.studentScores.sort((a, b) => a.id.localeCompare(b.id));
        }

        result.ok = true;
        return result;
    } catch (e) {
        console.error('Error in getScores:', e);
        throw e;
    }
}

/**
 * Витягує список пар з HTML
 */
function parseSchedule(html: string): ScheduleItem[] {
    let idx = html.indexOf('<thead>');
    if (idx === -1) return [];

    let theadEnd = html.indexOf('</thead>', idx);
    if (theadEnd === -1) return [];

    let theadContent = html.slice(idx, theadEnd);

    let firstTrStart = theadContent.indexOf('<tr>');
    let firstTrEnd = theadContent.indexOf('</tr>', firstTrStart);
    if (firstTrStart === -1 || firstTrEnd === -1) return [];

    let firstRow = theadContent.slice(firstTrStart, firstTrEnd);

    let secondTrStart = theadContent.indexOf('<tr>', firstTrEnd);
    let secondTrEnd = theadContent.indexOf('</tr>', secondTrStart);
    let thirdTrStart = theadContent.indexOf('<tr>', secondTrEnd);
    let thirdTrEnd = theadContent.indexOf('</tr>', thirdTrStart);
    if (thirdTrStart === -1 || thirdTrEnd === -1) return [];

    let thirdRow = theadContent.slice(thirdTrStart, thirdTrEnd);

    const result: ScheduleItem[] = [];

    const thStartRegex = /<th\b/g;
    const positions: number[] = [];

    let match: RegExpExecArray | null;
    while ((match = thStartRegex.exec(firstRow)) !== null) {
        positions.push(match.index);
    }
    positions.push(firstRow.length);

    const thirdPositions: number[] = [];
    const thirdThStartRegex = /<th\b/g;
    while ((match = thirdThStartRegex.exec(thirdRow)) !== null) {
        thirdPositions.push(match.index);
    }
    thirdPositions.push(thirdRow.length);

    for (let i = 0; i < positions.length - 1; i++) {
        const start = positions[i];
        const end = positions[i + 1];
        const thFull = firstRow.slice(start, end);

        const closeIdx = thFull.indexOf('</th>');
        if (closeIdx === -1) continue;

        const thTag = thFull.slice(0, closeIdx + 5);
        const thContent = thTag.replace(/<th[^>]*>/, '').replace(/<\/th>/, '');

        if (!thContent.trim()) continue;

        let moduleMatch = thContent.match(/^(М\d+)<br>/);
        if (moduleMatch) {
            const moduleNum = moduleMatch[1];
            const timeMatch = thContent.match(/<br[^>]*>\s*(\d{2}:\d{2}-\d{2}:\d{2})/);
            const time = timeMatch ? timeMatch[1].trim() : '';
            result.push({
                teacher: undefined,
                date: undefined,
                type: 'МД',
                time: time,
                index: `module_${moduleNum}`,
                description: `Модуль ${moduleNum}`,
            });
            continue;
        }

        if (thContent.match(/Підсум\.|Всього|Невиправд\./)) {
            continue;
        }

        const dataHthMatch = thTag.match(/data-hth="([^"]+)"/);
        if (!dataHthMatch) continue;

        const dataHth = dataHthMatch[1];

        const aMatch = thContent.match(/data-ind="([^"]+)"/);
        if (!aMatch) continue;

        const index = aMatch[1];
        const dateMatch = thContent.match(/>(\d{2}\.\d{2}\.\d{4})</);
        const date = dateMatch ? dateMatch[1] : '';
        const timeMatch = thContent.match(/<br[^>]*>\s*(\d{2}:\d{2}-\d{2}:\d{2})/);
        const time = timeMatch ? timeMatch[1].trim() : '';
        const parts = dataHth.split(',').map((p) => p.trim());
        const teacher = parts[0] || '';

        let type = '';
        if (parts[1]) {
            const dateTypeParts = parts[1].split(/\s+/);
            type = dateTypeParts[1] || '';
        }

        result.push({ teacher, date, type, time, index });
    }

    const descriptions = parseDescriptions(html);
    for (const item of result) {
        if (item.index && !item.index.startsWith('module_') && descriptions.has(item.index)) {
            item.description = descriptions.get(item.index);
        }
    }

    return result;
}

/**
 * Витягує описи занять з HTML
 */
function parseDescriptions(html: string): Map<string, string> {
    const descriptions = new Map<string, string>();
    const divRegex = /<div\s+id="r(\d+)"\s+class="hidden">\s*([\s\S]*?)\s*<br>/g;
    let match: RegExpExecArray | null;

    while ((match = divRegex.exec(html)) !== null) {
        const index = match[1];
        const content = match[2].trim();

        if (content && !content.startsWith('<')) {
            descriptions.set(index, content);
        }
    }

    return descriptions;
}

/**
 * Витягує список оцінок з HTML
 */
function parseScores(html: string, expectedScoresCount: number): StudentScores[] {
    const studentRows = html.match(/<tr\s+[^>]*id="s\d+"[\s\S]*?<\/tr>/g) || [];
    const result: StudentScores[] = [];

    for (const row of studentRows) {
        const idMatch = row.match(/id="(s\d+)"/);
        const id = idMatch ? idMatch[1] : '';
        const allTds = [...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)];

        const scoresMap = new Map<number, string[]>();

        for (const tdMatch of allTds) {
            const fullTd = tdMatch[0];
            const tdContent = tdMatch[1].trim();
            const dataItemMatch = fullTd.match(/data-item="(\d+)"/);

            if (!dataItemMatch) continue;

            const dataItem = Number(dataItemMatch[1]);

            if (
                fullTd.match(/class="[^"]*\bf\s+f1\b[^"]*"/) ||
                fullTd.match(/class="[^"]*\bf1\b[^"]*"/)
            ) {
                continue;
            }

            if (
                fullTd.match(/class="[^"]*\bf\s+f2\b[^"]*"/) ||
                fullTd.match(/class="[^"]*\bf2\b[^"]*"/)
            ) {
                continue;
            }

            const score = tdContent || '';

            if (!scoresMap.has(dataItem)) {
                scoresMap.set(dataItem, [score]);
            } else {
                scoresMap.get(dataItem)!.push(score);
            }
        }

        const sortedItems = Array.from(scoresMap.entries()).sort((a, b) => a[0] - b[0]);
        const scores = sortedItems.map(([_, values]) => values);

        const finalMatch = row.match(/<td[^>]*class="[^"]*\bf\s+f1\b[^"]*"[^>]*>([\s\S]*?)<\/td>/);
        const finalScore = finalMatch ? finalMatch[1].trim() : '';

        const absenceMatches = [
            ...row.matchAll(/<td[^>]*class="[^"]*\bf\s+f2\b[^"]*"[^>]*>([\s\S]*?)<\/td>/g),
        ];
        const absences = absenceMatches[0] ? Number(absenceMatches[0][1].trim() || 0) : 0;
        const uabsences = absenceMatches[1] ? Number(absenceMatches[1][1].trim() || 0) : 0;

        result.push({ id, scores, absences, uabsences, finalScore });
    }

    return result;
}
