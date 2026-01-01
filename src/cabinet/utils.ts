/**
 * Отримати ймовірний семестр поточної дати
 * @category Cabinet
 * @remarks
 * - `ok` — Успіх отримання токену
 * - `sesID` — ID сесії користувача
 * - `sessGUID` — GUID сесії з cookie
 */
export function getSemester() {
    const year = new Date().getFullYear();
    const febStart = new Date(year, 1, 1); // лютий = 1
    const sepStart = new Date(year, 8, 1); // вересень = 8
    const date = new Date();
    if (!(date < febStart || date >= sepStart)) {
        return 2;
    } else {
        return 1;
    }
}
