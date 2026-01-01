import { Discipline, DataStudent } from '../cabinetStudent/types.js';
import { DataTeacher, AcademicGroup } from '../cabinetTeacher/types.js';
/**
 * Парсить дані з сторінки n=31 (анкетні дані)
 */
export declare function parseDataPageN31(html: string): Partial<DataStudent>;
/**
 * Парсить дані з сторінки n=3 (загальна інформація)
 */
export declare function parseDataPageN3(html: string): Partial<DataStudent>;
/**
 * Парсить сторінку "Семестрові бали" (n=6) і повертає список дисциплін
 */
export declare function parseDisciplinesPageN6(html: string): Discipline[];
/**
 * Парсить HTML і повертає масив дисциплін (n=7)
 * @param html - HTML сторінки з select[id="prt"]
 */
export declare function parseDisciplinesPageN7(html: string): Discipline[];
/**
 * Парсить головну сторінку кабінету викладача
 * @param html - HTML сторінки кабінету викладача
 * @returns Дані викладача
 */
export declare function parseTeacherData(html: string): DataTeacher;
/**
 * Парсить сторінку зі списком академічних груп викладача
 * @param html - HTML сторінки "Академічні групи"
 * @returns Список груп викладача
 */
export declare function parseGroupsPage(html: string, semester: number): AcademicGroup[];
/**
 * Декодує назву групи з URL-encoded формату
 * @param encodedName - URL-encoded назва групи
 * @returns Декодована назва групи
 */
export declare function decodeGroupName(encodedName: string): string;
