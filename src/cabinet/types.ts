/**
 * sesID та sessGUID користувача
 * @category Cabinet
 * @remarks
 * - `ok` — Успіх отримання токену
 * - `sesID` — ID сесії користувача
 * - `sessGUID` — GUID сесії з cookie
 */
export interface SessionData {
    ok: boolean;
    sesID: string;
    sessGUID: string;
}

/**
 * Анкетні дані студента
 * @category Cabinet
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
export interface QuestionnaireData {
    ok: boolean;
    // ПІБ студента
    fullName?: string;
    lastName?: string;
    firstName?: string;
    middleName?: string;
    // Загальні дані
    birthDate?: string;
    gender?: string;
    previousFullName?: string;
    country?: string;
    lastNameEng?: string;
    firstNameEng?: string;
    middleNameEng?: string;
    // Контактні дані
    email?: string;
    phones?: string[];
    // Дані про навчання
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
