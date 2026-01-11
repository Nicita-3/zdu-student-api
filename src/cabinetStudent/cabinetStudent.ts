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
     * Данні студента {@link Data}
     */
    public data?: DataStudent;

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
     * Базове значення семестру
     */
    private setSemester() {
        this.semester = getSemester();
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
     * @returns Об'єкт {@link Data}
     */
    public async getData(): Promise<DataStudent> {
        if (!this.sesID || !this.sessGUID) return { ok: false };
        try {
            const data = await getDataStudent(this.sesID, this.sessGUID);
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
    public async getAllScores(semester?: 1 | 2): Promise<Scores[]> {
        if (!this.sesID || !this.sessGUID) return [];
        if (!this.disciplines?.length) return [];

        const targetSemester = semester ?? this.semester;
        const allScores: Scores[] = [];

        try {
            for (const discipline of this.disciplines) {
                const scores = await getScores(
                    this.sesID,
                    this.sessGUID,
                    discipline.prId,
                    targetSemester,
                );

                if (scores.ok) {
                    allScores.push(scores);
                }
            }

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
