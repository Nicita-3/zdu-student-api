import { Teacher } from "../types.ts";

/**
* Повертає список викладачів
* 
* @param query - Рядок пошуку викладача
* @returns Масив викладачів
* 
* Приклад використання
* ```ts
* console.log((await getTeachers('Кривонос Олександр')));
* ```
* 
* Виведе:
* ```JSON
* [
*   {
*       name: 'Кривонос О.М.',
*       id: '420',
*       faculty: 'Кафедра комп’ютерних наук та інформаційних технологій',
*       surname: 'Кривонос',
*       firstname: 'Олександр',
*       lastname: 'Миколайович'
*   }
* ]
* ```
*/
export async function getTeachers(query?: string) {
    try {
        const url = `https://dekanat.zu.edu.ua/cgi-bin/timetable_export.cgi?req_type=obj_list&req_mode=teacher&show_ID=yes&req_format=json&coding_mode=UTF8&bs=%D1%F4%EE%F0%EC%F3%E2%E0%F2%E8+%E7%E0%EF%E8%F2`;
        const response = await fetch(url);
        if (!response.ok) return [];

        const data = await response.json();

        let teachers: Teacher[] = data.psrozklad_export.departments.flatMap(
            (dept: { name: string; objects: { name: string; ID: string; P: string; I: string; B: string }[] }) =>
                dept.objects.map(
                    (t: { name: string; ID: string; P: string; I: string; B: string }) => ({
                        name: t.name,
                        id: t.ID,
                        faculty: dept.name,
                        surname: t.P,
                        firstname: t.I,
                        lastname: t.B
                    })
                )
        );

        if (query) {
            const q = query.toLowerCase();

            teachers = teachers.filter(t => {
                const shortName = t.name.toLowerCase();
                const fullName = `${t.surname} ${t.firstname} ${t.lastname}`.toLowerCase();  
                const fullNameNoMiddle = `${t.surname} ${t.firstname}`.toLowerCase();        
                const surname = t.surname.toLowerCase();
                const firstname = t.firstname.toLowerCase();
                const lastname = t.lastname.toLowerCase();

                return (
                    shortName.includes(q) ||
                    fullName.includes(q) ||
                    fullNameNoMiddle.includes(q) ||
                    surname.includes(q) ||
                    firstname.includes(q) ||
                    lastname.includes(q) ||
                    t.id.includes(q)
                );
            });
        }

        return teachers;

    } catch (e) {
        return [];
    }
}
