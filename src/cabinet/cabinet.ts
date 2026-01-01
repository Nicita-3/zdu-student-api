import { getSesId } from './sesId.js';
import { isValidSession } from './validSession.js';
import { getСurrentDisciplines } from './disciplines.js';
import { Discipline, Disciplines, Data, Scores } from './types.js';
import { getData } from './data.js';
import { getScores } from './scores.js';

/**
 * Клас кабінету студента
 * @category Cabinet
 */
export class Cabinet {
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
     * Семестр для пошуку оцінок (0 - перший, 1 - другий)
     */
    public semester: 0 | 1 = 0;

    /**
     * Список дисциплін {@link Discipline}
     */
    public disciplines: Discipline[] = [];

    /**
     * Данні студента {@link Data}
     */
    public data?: Data;

    /**
     * Оціки з усіх предметів {@link Scores}
     */
    public allScores?: Scores[];

    /**
     * Айді в системі оцінювання
     */
    private id?: string;

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
        const accountData = await getSesId(login ?? this.login, password ?? this.password);
        this.setSemester();
        if (accountData.ok) {
            this.sesID = accountData.sesID;
            this.sessGUID = accountData.sessGUID;
            return true;
        }
        return false;
    }

    /**
     * Базове значення семестру
     */
    private setSemester() {
        const year = new Date().getFullYear();
        const febStart = new Date(year, 1, 1); // лютий = 1
        const sepStart = new Date(year, 8, 1); // вересень = 8
        const date = new Date();
        if (!(date < febStart || date >= sepStart)) {
            this.semester = 1;
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
        const ses = await isValidSession(sesID, sessGUID);
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
        return await isValidSession(this.sesID, this.sessGUID);
    }

    /**
     * Отримати дисципліни поточного семестру студента
     * @returns Масив дисциплін {@link Disciplines}
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
     * @returns Об'єкт {@link ata}
     */
    public async getData(): Promise<Data> {
        if (!this.sesID || !this.sessGUID) return { ok: false };
        try {
            const data = await getData(this.sesID, this.sessGUID);
            if (data.ok) {
                this.data = data;
            }
            return data;
        } catch {
            return { ok: false };
        }
    }

    /**
     * Отримати оцінки з всіх предметів
     */
    public async getAllScores(semester?: 0 | 1): Promise<Scores[]> {
        if (!this.sesID || !this.sessGUID) return [];
        if (!this.disciplines?.length) return [];

        const targetSemester = semester ?? this.semester;

        try {
            const scorePromises = this.disciplines.map((discipline) =>
                getScores(this.sesID!, this.sessGUID!, discipline.prId, targetSemester),
            );
            const results = await Promise.all(scorePromises);
            const allScores = results.filter((scores) => scores.ok);
            this.allScores = allScores;
            return allScores;
        } catch {
            return [];
        }
    }

    /**
     * Отримати айді в системі оцінювання
     */
    public async getId(): Promise<string | undefined> {
        if (this.id) return this.id;
        if (!this.sesID || !this.sessGUID) return undefined;
        if (!this.disciplines?.length) {
            await this.getDisciplines();
        }
        if (!this.disciplines?.length) return undefined;
        try {
            const result = await getScores(
                this.sesID,
                this.sessGUID!,
                this.disciplines[0].prId,
                this.semester,
            );
            return result.studentId;
        } catch {
            return undefined;
        }
    }
}
