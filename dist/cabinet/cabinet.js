import { getSesId } from './sesId.js';
import { isValidSession } from './validSession.js';
import { getСurrentDisciplines } from './disciplines.js';
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
     * Семестр для пошуку оцінок (0 - перший, 1 - другий)
     */
    semester = 0;
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
    setSemester() {
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
    async isValidSession() {
        if (!this.sesID || !this.sessGUID)
            return false;
        return await isValidSession(this.sesID, this.sessGUID);
    }
    /**
     * Отримати дисципліни поточного семестру студента
     * @returns Масив дисциплін {@link Disciplines}
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
     * @returns Об'єкт {@link ata}
     */
    async getData() {
        if (!this.sesID || !this.sessGUID)
            return { ok: false };
        try {
            const data = await getData(this.sesID, this.sessGUID);
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
        try {
            const scorePromises = this.disciplines.map((discipline) => getScores(this.sesID, this.sessGUID, discipline.prId, targetSemester));
            const results = await Promise.all(scorePromises);
            const allScores = results.filter((scores) => scores.ok);
            this.allScores = allScores;
            return allScores;
        }
        catch {
            return [];
        }
    }
}
