/**
 * Факультет
 * - `id` — Числовий ідентифікатор факультету
 * - `name` — Повна назва факультету
 */
export interface Faculty {
  name: string;
  id: number;
}

/**
 * Група
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
 * Група
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
};

/**
 * Аудиторія
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
*/
export type ScheduleTypes = 'group' | 'teacher' | 'room';