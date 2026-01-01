/**
 * Дані викладача з головної сторінки кабінету
 * @category CabinetTeacher
 * @remarks
 * **Статус запиту:**
 * - `ok` — Успіх отримання даних (true/false)
 *
 * **ПІБ викладача:**
 * - `fullName` — Повне ім'я викладача (Прізвище Ім'я По батькові)
 * - `lastName` — Прізвище
 * - `firstName` — Ім'я
 * - `middleName` — По батькові
 *
 * **Інформація про роботу:**
 * - `department` — Назва кафедри
 * - `partTimeHours` — Кількість годин за сумісництвом (число без "год.")
 * - `workDurationMonths` — Тривалість роботи в навчальному році (місяців)
 * - `totalPositionHours` — Загальна кількість годин за ставками (число без "год.")
 * - `workloadByStaff` — Розподілене навантаження за штатом (число без "год.")
 * - `totalWorkload` — Загальне розподілене навантаження (число без "год.")
 */
export interface DataTeacher {
    ok: boolean;
    // ПІБ викладача
    fullName?: string;
    lastName?: string;
    firstName?: string;
    middleName?: string;
    // Інформація про роботу
    department?: string;
    partTimeHours?: number;
    workDurationMonths?: number;
    totalPositionHours?: number;
    workloadByStaff?: number;
    totalWorkload?: number;
}

/**
 * Інформація про академічну групу
 * @category CabinetTeacher
 * @remarks
 * - `name` — Назва групи (наприклад: "23Мд-СОфіз")
 * - `semester` — Семестр: "1" (перше), "2" (друге)
 * - `encodedName` — URL-encoded назва групи для запитів
 * - `course` — Номер курсу (1-4)
 * - `specialty` — Повна назва спеціальності з кодом
 * - `faculty` — Назва факультету
 * - `teacherId` — ID викладача з параметра teacher в URL
 * - `journalUrl` — Відносний URL для переходу до журналу групи
 */
export interface AcademicGroup {
    name: string;
    semester: number;
    encodedName: string;
    course: number;
    specialty: string;
    faculty: string;
    teacherId: string;
    journalUrl: string;
}

/**
 * Список академічних груп викладача
 * @category CabinetTeacher
 * @remarks
 * - `ok` — Успіх отримання даних (true/false)
 * - `groups` — Масив груп {@link Group}
 */
export interface AcademicGroups {
    ok: boolean;
    groups: AcademicGroup[];
}
