import { Discipline, Data } from './types.js';
/**
 * Парсить дані з сторінки n=31 (анкетні дані)
 */
export declare function parseDataPageN31(html: string): Partial<Data>;
/**
 * Парсить дані з сторінки n=3 (загальна інформація)
 */
export declare function parseDataPageN3(html: string): Partial<Data>;
/**
 * Парсить сторінку "Семестрові бали" (n=6) і повертає список дисциплін
 */
export declare function parseDisciplinesPageN6(html: string): Discipline[];
/**
 * Парсить HTML і повертає масив дисциплін (n=7)
 * @param html - HTML сторінки з select[id="prt"]
 */
export declare function parseDisciplinesPageN7(html: string): Discipline[];
