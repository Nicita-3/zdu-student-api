import { DataTeacher } from '../cabinetTeacher/types.js';
import { DataStudent } from '../cabinetStudent/types.js';
/**
 * Отримати анкетні дані студента
 * @category CabinetTeacher
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
 * @example
 * ```typescript
 * const cb = new CabinetTeacher(process.env.LOGINTEACHER!, process.env.PASSWORDTEACHER!);
 * const data = await cb.getData(sesId, sessGUID);
 * // {
 *       ok: true,
 *       fullName: 'Іванов Іван Іванович',
 *       lastName: 'Іванов',
 *       firstName: 'Іван',
 *       middleName: 'Іванович',
 *       department: 'Кафедра комп’ютерних наук та інформаційних технологій',
 *       partTimeHours: 0,
 *       workDurationMonths: 10,
 *       totalPositionHours: 0,
 *       workloadByStaff: 68,
 *       totalWorkload: 68
 * // }
 * ```
 * @returns Об'єкт з запарсеними даними {@link DataTeacher}
 */
export declare function getDataTeacher(sesId: string, sessGUID: string): Promise<DataTeacher>;
/**
 * Отримати анкетні дані студента
 * @category CabinetStudent
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
 * @example
 * ```typescript
 * const cb = new CabinetTeacher(process.env.LOGINSTUDENT!, process.env.PASSWORDSTUDENT!);
 * const data = await cb.getData(sesId, sessGUID);
 * // {
 * //   ok: true,
 * //   fullName: 'Іванов Іван Іванович',
 * //   lastName: 'Іванов',
 * //   firstName: 'Іван',
 * //   middleName: 'Іванович',
 * //   birthDate: 'хх.хх.хххх',
 * //   gender: 'Чол',
 * //   country: 'УКРАЇНА',
 * //   email: 'student@example.com',
 * //   phones: ['+380(99)-123-45-67'],
 * //   faculty: 'Фізико-математичний факультет',
 * //   specialty: 'Середня освіта',
 * //   degree: 'бакалавр',
 * //   group: '23Бд-СОінф',
 * //   studyForm: 'Денна',
 * //   paymentForm: 'Держ.замовлення',
 * //   enrollmentOrder: 'ххх-К(ОС)',
 * //   enrollmentDate: 'хх.хх.2024',
 * //   studyDuration: '4 роки',
 * //   graduationDate: 'хх.хх.2028'
 * //   ...інші
 * // }
 * ```
 * @returns Об'єкт з запарсеними даними {@link Data}
 */
export declare function getDataStudent(sesId: string, sessGUID: string): Promise<DataStudent>;
