import { getSesId } from '../cabinet/session.js';
import { isValidSession } from '../cabinet/session.js';
import { getAcademicGroups } from './academicGroups.js';
import { DataTeacher, AcademicGroups, AcademicGroup } from './types.js';
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
    public login: string;

    /**
     * Пароль від кабінету викладача
     */
    public password: string;

    /**
     * ID сесії викладача
     */
    public sesID?: string;

    /**
     * GUID сесії з cookie
     */
    public sessGUID?: string;

    /**
     * Семестр для пошуку оцінок (0 - перший, 1 - другий)
     */
    public semester: 1 | 2 = 1;

    /**
     * Данні викладача {@link DataTeacher}
     */
    public data?: DataTeacher;

    /**
     * Список академічних груп {@link AcademicGroup}
     */
    public academicGroups: AcademicGroup[] = [];

    /**
     * Конструктор
     * @param login - Логін користувача
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
            'teacher',
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
        const one = (await this.getAcademicGroups()).ok;
        const two = (await this.getData()).ok;
        return one && two;
    }

    /**
     * Відновлення сесії
     */
    public async setSession(sesID: string, sessGUID: string): Promise<boolean> {
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
    public async isValidSession(): Promise<boolean> {
        if (!this.sesID || !this.sessGUID) return false;
        return await isValidSession(this.sesID, this.sessGUID, 'teacher');
    }

    /**
     * Отримати всі академічні групи
     * @returns Об'єкт академічних груп {@link AcademicGroups}
     */
    public async getAcademicGroups(): Promise<AcademicGroups> {
        if (!this.sesID || !this.sessGUID) return { ok: false, groups: [] };
        try {
            const academicGroupsData = await getAcademicGroups(this.sesID, this.sessGUID);
            if (academicGroupsData.ok) {
                this.academicGroups = academicGroupsData.groups;
            }
            return academicGroupsData;
        } catch {
            return { ok: false, groups: [] };
        }
    }

    /**
     * Отримати анкетні данні викладача
     * @returns Об'єкт {@link Data}
     */
    public async getData(): Promise<DataTeacher> {
        if (!this.sesID || !this.sessGUID) return { ok: false };
        try {
            const data = await getDataTeacher(this.sesID, this.sessGUID);
            if (data.ok) {
                this.data = data;
            }
            return data;
        } catch (err) {
            console.log(err);
            return { ok: false };
        }
    }
}
