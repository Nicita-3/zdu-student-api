/**
 * Перевіряє чи є це сторінка авторизації
 */
export function isLoginPage(html) {
    return (html.includes('Авторизація користувача') ||
        html.includes('user_name') ||
        html.includes('Недійсний ідентифікатор сесії користувача'));
}
/**
 * Генерує cookie строку з DateTime та SessGUID
 */
export function generateCookieString(sessGUID) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const dateTime = `${day}.${month}.${year}+${hours}%3A${minutes}%3A${seconds}`;
    return `DateTime=${dateTime}; SessGUID=${sessGUID}`;
}
