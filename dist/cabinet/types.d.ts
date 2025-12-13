/**
 * sesID та sessGUID користувача
 * @category Cabinet
 * @remarks
 * - `ok` — Успіх отримання токену
 * - `sesID` — Айді сесії
 * - `sessGUID` — Унікальний token у cookie для ідентифікації сесії
 */
export interface SessionData {
    ok: boolean;
    sesID: string;
    sessGUID: string;
}
