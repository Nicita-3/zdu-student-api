import { getSesId, isValidSession } from '../cabinet/session.js';
import { getСurrentDisciplines } from './disciplines.js';
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
    login;
    /**
     * Пароль від кабінету студента
     */
    password;
    /**
     * ID сесії користувача
     */
    sesID;
    /**
     * GUID сесії з cookie
     */
    sessGUID;
    /**
     * Семестр для пошуку оцінок (1 - перший, 2 - другий)
     */
    semester = 1;
    /**
     * Список дисциплін {@link Discipline}
     */
    disciplines = [];
    /**
     * Данні студента {@link Data}
     */
    data;
    /**
     * Оціки з усіх предметів {@link Scores}
     */
    allScores;
    /**
     * Айді в системі оцінювання
     */
    id;
    /**
     * Конструктор
     * @param login - Прізвище користувача
     * @param password - Пароль
     */
    constructor(login, password) {
        this.login = login;
        this.password = password;
    }
    /**
     * Авторизація
     */
    async auth(login, password) {
        const accountData = await getSesId(login ?? this.login, password ?? this.password, 'student');
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
    setSemester() {
        this.semester = getSemester();
    }
    /**
     * Отримання всіх данних
     */
    async loadData() {
        const one = (await this.getDisciplines()).ok;
        const two = (await this.getData()).ok;
        const three = (await this.getAllScores()).length > 0;
        return one && two && three;
    }
    /**
     * Відновлення сесії
     */
    async setSession(sesID, sessGUID) {
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
    async isValidSession() {
        if (!this.sesID || !this.sessGUID)
            return false;
        return await isValidSession(this.sesID, this.sessGUID, 'student');
    }
    /**
     * Отримати дисципліни поточного семестру студента
     * @returns Об'єкт дисциплін {@link Disciplines}
     */
    async getDisciplines() {
        if (!this.sesID || !this.sessGUID)
            return { ok: false, disciplines: [] };
        try {
            const disciplinesData = await getСurrentDisciplines(this.sesID, this.sessGUID);
            if (disciplinesData.ok) {
                this.disciplines = disciplinesData.disciplines;
            }
            return disciplinesData;
        }
        catch {
            return { ok: false, disciplines: [] };
        }
    }
    /**
     * Отримати анкетні данні студента
     * @returns Об'єкт {@link Data}
     */
    async getData() {
        if (!this.sesID || !this.sessGUID)
            return { ok: false };
        try {
            const data = await getDataStudent(this.sesID, this.sessGUID);
            if (data.ok) {
                this.data = data;
            }
            return data;
        }
        catch {
            return { ok: false };
        }
    }
    /**
     * Отримати оцінки з всіх предметів
     */
    async getAllScores(semester) {
        if (!this.sesID || !this.sessGUID)
            return [];
        if (!this.disciplines?.length)
            return [];
        const targetSemester = semester ?? this.semester;
        const allScores = [];
        try {
            for (const discipline of this.disciplines) {
                const scores = await getScores(this.sesID, this.sessGUID, discipline.prId, targetSemester);
                if (scores.ok) {
                    allScores.push(scores);
                }
            }
            this.allScores = allScores;
            return allScores;
        }
        catch {
            return [];
        }
    }
    /**
     * Отримати айді в системі оцінювання
     */
    async getId() {
        if (this.id)
            return this.id;
        if (!this.sesID || !this.sessGUID)
            return undefined;
        if (!this.disciplines?.length) {
            await this.getDisciplines();
        }
        if (!this.disciplines?.length)
            return undefined;
        try {
            const result = await getScores(this.sesID, this.sessGUID, this.disciplines[0].prId, this.semester);
            return result.studentId;
        }
        catch {
            return undefined;
        }
    }
}
