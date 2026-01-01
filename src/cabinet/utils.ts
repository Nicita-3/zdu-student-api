/**
 * Отримати ймовірний семестр поточної дати
 * @category Cabinet
 * @remarks
 * З 2 вересня по кінець січня - перший семестр
 * З 1 лютого по 1 вересня - другий семестр
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
