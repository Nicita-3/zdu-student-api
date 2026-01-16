/**
 * Анкетні дані студента
 * @category CabinetStudent
 * @remarks
 * **Статус запиту:**
 * - `ok` — Успіх отримання даних (true/false)
 *
 * **ПІБ студента:**
 * - `fullName` — Повне ім'я студента (Прізвище Ім'я По батькові)
 * - `lastName` — Прізвище
 * - `firstName` — Ім'я
 * - `middleName` — По батькові
 *
 * **Загальні дані:**
 * - `birthDate` — Дата народження (формат: DD.MM.YYYY)
 * - `gender` — Стать (Чол/Жін)
 * - `previousFullName` — Попереднє ПІБ студента (якщо змінювалось)
 * - `country` — Країна, з якої навчається студент
 * - `lastNameEng` — Прізвище англійською
 * - `firstNameEng` — Ім'я англійською
 * - `middleNameEng` — По батькові англійською (зазвичай немає)
 *
 * **Контактні дані:**
 * - `email` — Електронна пошта студента
 * - `phones` — Масив телефонних номерів студента
 *
 * **Дані про навчання:**
 * - `course` — Поточний курс
 * - `faculty` — Факультет
 * - `specialty` — Спеціальність (назва освітньої програми)
 * - `degree` — Ступінь / Освітньо-професійний ступінь (бакалавр, магістр тощо)
 * - `group` — Академічна група
 * - `studyForm` — Форма навчання (Денна, Заочна, Вечірня)
 * - `paymentForm` — Форма оплати навчання (Держ.замовлення, Контракт)
 * - `enrollmentOrder` — Номер наказу на зарахування
 * - `enrollmentDate` — Дата наказу на зарахування (формат: DD.MM.YYYY)
 * - `studyDuration` — Термін навчання (наприклад: "4 роки")
 * - `graduationDate` — Дата закінчення навчання (формат: DD.MM.YYYY)
 */
export interface DataStudent {
    ok: boolean;
    fullName?: string;
    lastName?: string;
    firstName?: string;
    middleName?: string;
    birthDate?: string;
    gender?: string;
    previousFullName?: string;
    country?: string;
    lastNameEng?: string;
    firstNameEng?: string;
    middleNameEng?: string;
    email?: string;
    phones?: string[];
    course?: number;
    faculty?: string;
    specialty?: string;
    degree?: string;
    group?: string;
    studyForm?: string;
    paymentForm?: string;
    enrollmentOrder?: string;
    enrollmentDate?: string;
    studyDuration?: string;
    graduationDate?: string;
}
/**
 * name та prId дисципліни
 * @category CabinetStudent
 * @remarks
 * - `name` — Повна назва дисципліни
 * - `prId` — Айді дисципліни
 */
export interface Discipline {
    name: string;
    prId: string;
}
/**
 * name та prId дисципліни
 * @category CabinetStudent
 * @remarks
 * - `ok` — Успіх отримання токену
 * - `disciplines` — Масив дисциплін {@link Discipline}
 */
export interface Disciplines {
    ok: boolean;
    disciplines: Discipline[];
}
/**
 * Опис заняття у кабінеті студента
 * @category CabinetStudent
 * @remarks
 * - `teacher` — Прізвище та ініціали викладача (undefined для модульних днів)
 * - `date` — Дата заняття у форматі "dd.mm.yyyy" (undefined для модульних днів)
 * - `type` — Тип заняття: "Лек", "ПрСем", "Лаб", "МК", "Екз", "МД"
 * - `time` — Час заняття у форматі "HH:MM-HH:MM"
 * - `index` — Значення атрибута `data-ind`, унікальний ідентифікатор
 * - `description` — Опис заняття (може бути undefined) ("Модуль ##" для модульних днів, де ## - номер модуля, наприклад М0, М1)
 */
export interface ScheduleItem {
    teacher?: string;
    date?: string;
    type: string;
    time: string;
    index: string;
    description?: string;
}
/**
 * Список оцінок студента.
 * @category CabinetStudent
 * @remarks
 * - `id` — Унікальний ідентифікатор студента
 * - `scores` — Оцінки по днях, масив масивів рядків (перший елемент - основна оцінка, другий елемент - оцінка перездачі)
 * - `absences` — Кількість пропусків
 * - `uabsences` — Кількість невиправлених пропусків
 * - `finalScore` — Фінальна оцінка
 */
export interface StudentScores {
    id: string;
    scores: string[][];
    absences: number;
    uabsences: number;
    finalScore: string;
}
/**
 * Об'єкт оцінок з предмету.
 * @category CabinetStudent
 * @remarks
 * - `ok` — Успіх отримання токену
 * - `prId` — Айді дисципліни
 * - `studentId` — Унікальний айді студента для предметів
 * - `scheduleItem` — Опис заняття у кабінеті студента {@link ScheduleItem}
 * - `studentScores` — Список оцінок студента {@link StudentScores}
 */
export interface Scores {
    ok: boolean;
    prId: string;
    studentId?: string;
    scheduleItem: ScheduleItem[];
    studentScores: StudentScores[];
}
