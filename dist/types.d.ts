/**
 * Факультет
 * @category Schedule
 *
 * @remarks
 * - `id` — Числовий ідентифікатор факультету
 * - `name` — Повна назва факультету
 */
export interface Faculty {
    name: string;
    id: number;
}
/**
 * Група
 * @category Schedule
 *
 * @remarks
 * - `name` — Повна назва групи
 * - `id` — Ідентифікатор групи
 * - `faculty` — Повна назва факультету
 */
export interface Group {
    name: string;
    id: string;
    faculty: string;
}
/**
 * Викладач
 * @category Schedule
 *
 * @remarks
 * - `name` — Ім'я викладача в форматі Прізвище І.П.
 * - `id` — Ідентифікатор викладача
 * - `faculty` — Повна назва факультету
 * - `surname` — Прізвище
 * - `firstname` — Ім'я
 * - `lastname` — По батькові
 */
export interface Teacher {
    name: string;
    id: string;
    faculty: string;
    surname: string;
    firstname: string;
    lastname: string;
}
/**
 * Аудиторія
 * @category Schedule
 *
 * @remarks
 * - `name` — Назва аудиторії
 * - `id` — Ідентифікатор аудиторії
 * - `block` — Назва блоку (гуртожиток/корпус), до якого належить аудиторія
 */
export interface Room {
    name: string;
    id: string;
    block: string;
}
/**
 * Типи для отримання розкладу.
 * @category Schedule
 *
 */
export type ScheduleTypes = 'group' | 'teacher' | 'room';
/**
 * Базова інформація про заняття
 * @category Schedule
 *
 * @remarks
 * - `object` — Назва групи, аудиторія, викладач
 * - `date` — Дата проведення заняття у форматі DD.MM.YYYY
 * - `comment` — Коментар до заняття
 * - `lesson_number` — Номер пари за розкладом (1–6)
 * - `lesson_name` — Назва пари
 * - `lesson_time` — Час проведення пари, наприклад "10:30-11:50"
 * - `lesson_description` — Повний текстовий опис пари (rosText = false)
 * - `stream_components` — ID груп потоку (цифрові коди), через кому
 */
export interface BaseLesson {
    object: string;
    date: string;
    comment: string;
    lesson_number: string;
    lesson_name: string;
    lesson_time: string;
    lesson_description?: string;
    stream_components?: string;
}
/**
 * Детальна інформація про заняття
 * Розділена на окремі поля (rosText = true)
 * @category Schedule
 *
 * @remarks
 * - `half` — Половина пари (не використовується)
 * - `teacher` — Основний викладач
 * - `teachers_add` — Додаткові викладачі
 * - `room` — Аудиторія, наприклад "319/№1"
 * - `group` — Список груп, які відвідують заняття / підгрупа
 * - `title` — Повна назва предмету або його код
 * - `type` — Тип заняття
 * - `replacement` — Позначка про заміну пари
 * - `reservation` — Зарезервована пара
 * - `online` — Чи є онлайн-посилання / онлайн-режим
 * - `comment4link` — Коментар до посилання (іноді використовується для Zoom/Meet) / підгрупа / коментар
 * - `link` — Посилання на онлайн-заняття
 */
export interface DetailedLesson extends BaseLesson {
    half: string;
    teacher: string;
    teachers_add: string;
    room: string;
    group: string;
    title: string;
    type: string;
    replacement: string;
    reservation: string;
    online: string;
    comment4link: string;
    link: string;
}
/**
 * Аудиторія
 * @category Audience
 *
 * @remarks
 * - `name` — Назва аудиторії
 * - `block` — Назва блоку
 * - `type` — Тип аудиторії
 * - `places` — Кількість місць
 * - `comment` — Коментар до аудиторії
 */
export interface AudienceRoom {
    name: string;
    block: string;
    type: string;
    places: string;
    comment: string;
}
/**
 * Блоки
 * @category Audience
 */
export type Blocks = '' | '№1' | '№2' | '№3' | '№4' | '№5' | 'гуртож №1' | 'гуртож №2' | 'гуртож №3' | 'гуртож №4' | 'гуртож №5';
/**
 * Тип аудиторії
 * @category Audience
 */
export interface TypeAudience {
    full: string;
    short: string;
}
/**
 * Доп. обладнання
 * @category Audience
 */
export interface Dop {
    name: string;
}
