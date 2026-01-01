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
