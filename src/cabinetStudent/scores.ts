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
        result.studentScores = parseScores(html1);
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
    let idx = html.indexOf('<th></th>');
    html = idx === -1 ? html : html.slice(idx + '<th></th>'.length);
    idx = html.indexOf('<th class="dh">');
    html = idx === -1 ? html : html.slice(0, idx);
    const regex =
        /<th[^>]*data-hth="([^"]+)"[^>]*>[\s\S]*?<a[^>]*data-ind="([^"]+)"[^>]*>[^<]+<\/a>[\s\S]*?<br>([^<]+)<\/th>/g;
    const result: ScheduleItem[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
        const [_, dataHth, index, time] = match;
        const parts = dataHth.split(',');
        const teacher = parts[0].trim();
        const dateType = parts[1]?.trim().split(' ') || [];
        const date = dateType[0] || '';
        const type = dateType[1] || '';
        result.push({ teacher, date, type, time: time.trim(), index });
    }

    return result;
}

/**
 * Витягує список оцінок з HTML
 */
function parseScores(html: string): StudentScores[] {
    const studentRows = html.match(/<tr\s+[^>]*id="s\d+"[\s\S]*?<\/tr>/g) || [];
    const result: StudentScores[] = [];

    for (const row of studentRows) {
        const idMatch = row.match(/id="(s\d+)"/);
        const id = idMatch ? idMatch[1] : '';

        const tdMatches = [...row.matchAll(/<td[^>]*data-item="(\d+)"[^>]*>([\s\S]*?)<\/td>/g)];

        const scoresMap = new Map<number, string[]>();
        for (const td of tdMatches) {
            const dataItem = Number(td[1]);
            const score = td[2].trim() || '';
            if (!scoresMap.has(dataItem)) {
                scoresMap.set(dataItem, [score]);
            } else {
                scoresMap.get(dataItem)!.push(score);
            }
        }

        const scores = Array.from(scoresMap.values());
        scores.shift();

        const finalMatch = row.match(/<td[^>]*class="f f1"[^>]*>([\s\S]*?)<\/td>/);
        const finalScore = finalMatch ? finalMatch[1].trim() : '';

        const absenceMatches = [...row.matchAll(/<td[^>]*class="f f2"[^>]*>([\s\S]*?)<\/td>/g)];
        const absences = absenceMatches[0] ? Number(absenceMatches[0][1].trim() || 0) : 0;
        const uabsences = absenceMatches[1] ? Number(absenceMatches[1][1].trim() || 0) : 0;

        result.push({ id, scores, absences, uabsences, finalScore });
    }

    return result;
}
