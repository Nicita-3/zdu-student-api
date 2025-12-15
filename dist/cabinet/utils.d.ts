/**
 * Перевіряє чи є це сторінка авторизації
 */
export declare function isLoginPage(html: string): boolean;
/**
 * Генерує cookie строку з DateTime та SessGUID
 */
export declare function generateCookieString(sessGUID: string): string;
