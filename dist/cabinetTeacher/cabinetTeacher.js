import { getSesId } from '../cabinet/session.js';
import { isValidSession } from '../cabinet/session.js';
import { getAcademicGroups } from './academicGroups.js';
import { getDataTeacher } from '../cabinet/data.js';
import { getSemester } from '../cabinet/utils.js';
/**
 * Клас кабінету викладача
 * @category CabinetTeacher
 */
export class CabinetTeacher {
    /**
     * Логін користувача
     */
    login;
    /**
     * Пароль від кабінету викладача
     */
    password;
    /**
     * ID сесії викладача
     */
    sesID;
    /**
     * GUID сесії з cookie
     */
    sessGUID;
    /**
     * Семестр для пошуку оцінок (0 - перший, 1 - другий)
     */
    semester = 1;
    /**
     * Данні викладача {@link DataTeacher}
     */
    data;
    /**
     * Список академічних груп {@link AcademicGroup}
     */
    academicGroups = [];
    /**
     * Конструктор
     * @param login - Логін користувача
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
        const accountData = await getSesId(login ?? this.login, password ?? this.password, 'teacher');
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
        const one = (await this.getAcademicGroups()).ok;
        const two = (await this.getData()).ok;
        return one && two;
    }
    /**
     * Відновлення сесії
     */
    async setSession(sesID, sessGUID) {
        this.setSemester();
        const ses = await isValidSession(sesID, sessGUID, 'teacher');
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
        return await isValidSession(this.sesID, this.sessGUID, 'teacher');
    }
    /**
     * Отримати всі академічні групи
     * @returns Об'єкт академічних груп {@link AcademicGroups}
     */
    async getAcademicGroups() {
        if (!this.sesID || !this.sessGUID)
            return { ok: false, groups: [] };
        try {
            const academicGroupsData = await getAcademicGroups(this.sesID, this.sessGUID);
            if (academicGroupsData.ok) {
                this.academicGroups = academicGroupsData.groups;
            }
            return academicGroupsData;
        }
        catch {
            return { ok: false, groups: [] };
        }
    }
    /**
     * Отримати анкетні данні викладача
     * @returns Об'єкт {@link Data}
     */
    async getData() {
        if (!this.sesID || !this.sessGUID)
            return { ok: false };
        try {
            const data = await getDataTeacher(this.sesID, this.sessGUID);
            if (data.ok) {
                this.data = data;
            }
            return data;
        }
        catch (err) {
            console.log(err);
            return { ok: false };
        }
    }
}
