import { Data } from './types.js';
/**
 * Отримати анкетні дані студента
 * @category Cabinet
 * @param sesId - ID сесії користувача
 * @param sessGUID - GUID сесії з cookie
 * @throws {Error} Якщо виникають проблеми з запитом або дані некоректні.
 * @example
 * ```typescript
 * const data = await getData(sesId, sessGUID);
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
export declare function getData(sesId: string, sessGUID: string): Promise<Data>;
