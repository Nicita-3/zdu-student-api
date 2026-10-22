import { getSesId, isValidSession } from '../cabinet/session.js';
import { getСurrentDisciplines } from './disciplines.js';
import { Discipline, Disciplines, DataStudent, Scores } from './types.js';
import { getScores } from './scores.js';
import { getSemester } from '../cabinet/utils.js';
import { getDataStudent } from '../cabinet/data.js';

/**
 * Клас кабінету студента
 * @category CabinetStudent
 */
export class CabinetStudent {
    /**
     * Прізвище користувача
     */
    public login: string;

    /**
     * Пароль від кабінету студента
     */
    public password: string;

    /**
     * ID сесії користувача
     */
    public sesID?: string;

    /**
     * GUID сесії з cookie
     */
    public sessGUID?: string;

    /**
     * Семестр для пошуку оцінок (1 - перший, 2 - другий)
     */
    public semester: 1 | 2 = 1;

    /**
     * Список дисциплін {@link Discipline}
     */
    public disciplines: Discipline[] = [];

    /**
     * Данні студента {@link DataStudent}
     */
    public data?: DataStudent;

    /**
     * Оцінки з усіх предметів {@link Scores}
     */
    public allScores?: Scores[];

    /**
     * Конструктор
     * @param login - Прізвище користувача
     * @param password - Пароль
     */
    constructor(login: string, password: string) {
        this.login = login;
        this.password = password;
    }

    /**
     * Авторизація
     */
    public async auth(login?: string, password?: string): Promise<boolean> {
        const accountData = await getSesId(
            login ?? this.login,
            password ?? this.password,
            'student',
        );
        this.setSemester();
        if (accountData.ok) {
            this.sesID = accountData.sesID;
            this.sessGUID = accountData.sessGUID;
            return true;
        }
        return false;
    }

    /**
     * Встановити семестр
     * @param semester - Семестр в форматі рядка або числа, якщо не передавати згенерується ймовірний семестр
     */
    public setSemester(semester?: 1 | 2 | '1' | '2') {
        if (!semester) this.semester = getSemester();
        else {
            if (semester === '1' || semester === 1) this.semester = 1;
            if (semester === '2' || semester === 2) this.semester = 2;
        }
    }

    /**
     * Отримання всіх данних
     */
    public async loadData(): Promise<boolean> {
        const one = (await this.getDisciplines()).ok;
        const two = (await this.getData()).ok;
        const three = (await this.getAllScores()).length > 0;
        return one && two && three;
    }

    /**
     * Відновлення сесії
     */
    public async setSession(sesID: string, sessGUID: string): Promise<boolean> {
        this.setSemester();
        const ses = await isValidSession(sesID, sessGUID, 'student');
        if (ses) {
            this.sesID = sesID;
            this.sessGUID = sessGUID;
        }
        return ses;
    }

    /**
     * Перевірка валідності сесії
     */
    public async isValidSession(): Promise<boolean> {
        if (!this.sesID || !this.sessGUID) return false;
        return await isValidSession(this.sesID, this.sessGUID, 'student');
    }

    /**
     * Отримати дисципліни поточного семестру студента
     * @returns Об'єкт дисциплін {@link Disciplines}
     */
    public async getDisciplines(): Promise<Disciplines> {
        if (!this.sesID || !this.sessGUID) return { ok: false, disciplines: [] };
        try {
            const disciplinesData = await getСurrentDisciplines(this.sesID, this.sessGUID);
            if (disciplinesData.ok) {
                this.disciplines = disciplinesData.disciplines;
            }
            return disciplinesData;
        } catch {
            return { ok: false, disciplines: [] };
        }
    }

    /**
     * Отримати анкетні данні студента
     * @returns Об'єкт {@link DataStudent}
     */
    public async getData(): Promise<DataStudent> {
        if (!this.sesID || !this.sessGUID) return { ok: false };
        try {
            const data = await getDataStudent(this.sesID, this.sessGUID);
            if (data.ok) {
                this.data = data;
                await this.getCourse();
            }
            return data;
        } catch {
            return { ok: false };
        }
    }

    /**
     * Отримати курс студента
     * @returns курс (число) або undefined
     */
    public async getCourse(): Promise<number | undefined> {
        if (!this.data) {
            const data = await this.getData();
            if (!data.ok || !this.data) return undefined;
        }

        if (this.data.course) return this.data.course;
        if (!this.data.enrollmentDate || !this.data.studyDuration) return undefined;

        const [d, m, y] = this.data.enrollmentDate.split('.').map(Number);
        const enrollmentDate = new Date(y, m - 1, d);

        const now = new Date();

        const academicYear = (date: Date) =>
            date.getMonth() >= 7 ? date.getFullYear() : date.getFullYear() - 1;

        const enrollmentYear = academicYear(enrollmentDate);
        const currentYear = academicYear(now);

        let course = currentYear - enrollmentYear + 1;

        const durationYears = parseInt(this.data.studyDuration);
        if (isNaN(durationYears)) return undefined;

        if (course < 1) course = 1;
        if (course > durationYears) return durationYears;

        this.data.course = course;
        return course;
    }

    /**
     * Отримати свої оцінки з окремого предмета
     * @param prId - ID дисципліни (див. {@link Discipline})
     * @param semester - Семестр, за замовчуванням {@link CabinetStudent.semester}
     * @returns Оцінки з предмета {@link Scores}
     */
    public async getScores(prId: string, semester?: 1 | 2): Promise<Scores> {
        const empty: Scores = { ok: false, prId, scheduleItem: [] };
        if (!this.sesID || !this.sessGUID) return empty;
        try {
            return await getScores(this.sesID, this.sessGUID, prId, semester ?? this.semester);
        } catch {
            return empty;
        }
    }

    /**
     * Отримати свої оцінки з усіх предметів поточного семестру
     * @param semester - Семестр, за замовчуванням {@link CabinetStudent.semester}
     * @returns Масив оцінок {@link Scores} (тільки успішно отримані предмети)
     */
    public async getAllScores(semester?: 1 | 2): Promise<Scores[]> {
        if (!this.sesID || !this.sessGUID) return [];
        if (!this.disciplines?.length) await this.getDisciplines();
        if (!this.disciplines?.length) return [];

        const allScores: Scores[] = [];
        for (const discipline of this.disciplines) {
            const scores = await this.getScores(discipline.prId, semester);
            if (scores.ok) {
                scores.name ??= discipline.name;
                allScores.push(scores);
            }
        }

        this.allScores = allScores;
        return allScores;
    }
}
