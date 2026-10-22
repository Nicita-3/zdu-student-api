# ZDU Student API

API для **Житомирського державного університету імені Івана Франка**.

### СТАБІЛЬНЕ API:

Бібліотека надає програмний доступ до відкритих сервісів університету, зокрема:

- 📅 розклад занять студентів / викладачів / аудиторій
- 🚪 зайняті / вільні аудиторії
- 🏫 списки аудиторій
- 👥 списки груп
- 👨‍🏫 списки викладачів
- 🎯 TypeScript підтримка з повною типізацією
- 📱 Сумісність з Node.js та браузерними середовищами

### BETA API:

#### 📚 Кабінет студента (CabinetStudent)

- 🔐 Авторизація в кабінеті студента
- 📝 Отримання анкетних даних студента (ПІБ, дата народження, стать, контакти, факультет, спеціальність, група, форма навчання)
- 📖 Отримання дисциплін поточного семестру
- 📊 Отримання своїх оцінок з окремого предмета (з деталізацією по заняттях, пропускам та фінальною оцінкою)
- 📈 Отримання своїх оцінок з усіх дисциплін одночасно
- 🎓 Отримання оцінок за конкретний семестр (1 або 2)
- 💾 Відновлення попередньої сесії без повторної авторизації
- ✅ Перевірка валідності поточної сесії
- 🔄 Автоматичне визначення поточного семестру
- 📦 Масове завантаження всіх даних (анкетні дані + дисципліни + оцінки)
- 📅 Інформація про розклад занять для кожної дисципліни (викладач, дата, час, тип заняття)

#### 👨‍🏫 Кабінет викладача (CabinetTeacher)

- 🔐 Авторизація в кабінеті викладача
- 📝 Отримання анкетних даних викладача (ПІБ, кафедра, години роботи, навантаження)
- 👥 Отримання списку всіх академічних груп викладача
- 📊 Деталізована інформація про кожну групу (назва, курс, семестр, спеціальність, факультет)
- 🔗 URL-посилання на журнали академічних груп
- 💼 Інформація про навчальне навантаження (години за штатом, за сумісництвом, загальне)
- 📆 Тривалість роботи в навчальному році
- 💾 Відновлення попередньої сесії без повторної авторизації
- ✅ Перевірка валідності поточної сесії
- 📦 Масове завантаження всіх даних (анкетні дані + академічні групи)

### 🔮 У планах

- стабільне API кабінету студента
- стабільне API кабінету викладача
- Отримання історії оцінок з усіх предметів
- Отримання айді всіх доступних студентів для окремого викладача
- Отримання всіх оцінок через кабінет викладача

> ⚠️ Проєкт **не є офіційним** API університету.

---

## Встановлення

```bash
npm install zdu-student-api
```

або

```bash
pnpm install zdu-student-api
```

---

## Базове використання

### Отримання розкладу

```ts
import { Schedule, scheduleErrors } from 'zdu-student-api';

const schedule = new Schedule();
schedule.group = '23Бд-СОінф';
schedule.type = 'group';
schedule.rosText = true;
schedule.allStreamComponents = true;

try {
    const sc = await schedule.getSchedule();
    console.log('Розклад:', sc);
} catch (err: any) {
    console.error(err.message);
    console.error(scheduleErrors[JSON.parse(err.message).errorcode]);
}
```

---

### Розклад для аудиторії

```ts
const schedule = new Schedule();
schedule.roomId = 35;
schedule.type = 'room';
schedule.rosText = true;

const sc = await schedule.getSchedule();
console.log(sc);
```

---

## Довідкові методи

### Групи

```ts
import { getGroups } from 'zdu-student-api';

const groups = await getGroups('25Бд-Комп');
console.log(groups);
```

---

### Викладачі

```ts
import { getTeachers } from 'zdu-student-api';

const teachers = await getTeachers('Кривонос Олександр');
console.log(teachers);
```

---

### Аудиторії

```ts
import { getRooms } from 'zdu-student-api';

const rooms = await getRooms('319');
console.log(rooms);
```

---

### Типи аудиторій

```ts
import { getTypesAudience } from 'zdu-student-api';

const types = await getTypesAudience('Ле');
console.log(types);
```

---

### Аудиторії за корпусом / гуртожитком

```ts
import { Audience } from 'zdu-student-api';

const audience = new Audience();
audience.blockName = 'гуртож №3';

const audiences = await audience.getAudience();
console.log(audiences);
```

---

### Додаткові параметри (DOPs)

```ts
import { getDops } from 'zdu-student-api';

const dops = await getDops();
console.log(dops);
```

---

## Кабінет студента

### Базове використання

```ts
import { CabinetStudent } from 'zdu-student-api';

const cabinet = new CabinetStudent('ПРІЗВИЩЕ', 'ПАРОЛЬ');

// Авторизація
const authSuccess = await cabinet.auth();
if (authSuccess) {
    console.log('Авторизовано успішно!');
    console.log('Session ID:', cabinet.sesID);
}
```

---

### Отримання всіх даних студента

```ts
const cabinet = new CabinetStudent('ПРІЗВИЩЕ', 'ПАРОЛЬ');
await cabinet.auth();

// Завантажити всі дані (анкетні дані, дисципліни, оцінки)
await cabinet.loadData();

console.log('Дані студента:', cabinet.data);
console.log('Дисципліни:', cabinet.disciplines);
console.log('Оцінки:', cabinet.allScores);
```

---

### Робота з дисциплінами та оцінками

```ts
const cabinet = new CabinetStudent('ПРІЗВИЩЕ', 'ПАРОЛЬ');
await cabinet.auth();

// Отримати дисципліни поточного семестру
const disciplines = await cabinet.getDisciplines();
console.log('Дисципліни:', disciplines);

// Отримати оцінки з окремого предмета (prId береться зі списку дисциплін)
const scores = await cabinet.getScores(disciplines.disciplines[0].prId);
console.log('Предмет:', scores.name);
console.log('Заняття:', scores.scheduleItem);
console.log('Мої оцінки:', scores.studentScores);

// Отримати оцінки з усіх дисциплін
const allScores = await cabinet.getAllScores();
console.log('Всі оцінки:', allScores);

// Отримати оцінки за конкретний семестр
const firstSemesterScores = await cabinet.getAllScores(1);
const secondSemesterScores = await cabinet.getAllScores(2);
const oneSubjectSecondSemester = await cabinet.getScores('55379', 2);
```

> ℹ️ Журнал університету показує лише оцінки студента, який авторизований.
> Рядки інших студентів анонімізовані, тому бібліотека повертає тільки ваші оцінки.

Приклад результату `getScores`:

```ts
{
  ok: true,
  prId: '55377',
  name: 'Історичне джерелознавство',
  scheduleItem: [
    { teacher: 'Іванов І.І.', date: '15.09.2026', type: 'ПрСем', time: '11:30-12:50', index: '865161', description: undefined },
    { teacher: 'Іванов І.І.', date: '01.10.2026', type: 'ПрСем', time: '11:30-12:50', index: '872194', description: undefined },
    { teacher: undefined, date: undefined, type: 'МД', time: '', index: 'module_М1', description: 'Модуль М1' }
  ],
  studentScores: {
    // по одному елементу на кожне заняття з scheduleItem:
    // [основна оцінка, перездача] для заняття, [сума балів] для модуля
    scores: [['', ''], ['90', ''], ['90']],
    absences: 0,   // пропусків
    uabsences: 0,  // невиправданих пропусків
    finalScore: '90'
  }
}
```

---

### Відновлення сесії

```ts
const cabinet = new CabinetStudent('ПРІЗВИЩЕ', 'ПАРОЛЬ');

// Відновити попередню сесію
const sesID = 'YOUR_SESSION_ID';
const sessGUID = 'YOUR_SESSION_GUID';

// Сесія активна тільки 24 години і стає застарілою як тільки відбувається нова авторизація викладача в кабінеті
const sessionValid = await cabinet.setSession(sesID, sessGUID);
if (sessionValid) {
    console.log('Сесію відновлено!');
    await cabinet.loadData();
}
```

---

### Перевірка валідності сесії

```ts
const cabinet = new CabinetStudent('ПРІЗВИЩЕ', 'ПАРОЛЬ');
await cabinet.auth();

// Перевірити чи сесія ще дійсна
const isValid = await cabinet.isValidSession();
console.log('Сесія дійсна:', isValid);
```

---

## Кабінет викладача

### Базове використання

```ts
import { CabinetTeacher } from 'zdu-student-api';

const cabinet = new CabinetTeacher('ЛОГІН', 'ПАРОЛЬ');

// Авторизація
const authSuccess = await cabinet.auth();
if (authSuccess) {
    console.log('Авторизовано успішно!');
    console.log('Session ID:', cabinet.sesID);
}
```

---

### Отримання даних викладача

```ts
const cabinet = new CabinetTeacher('ЛОГІН', 'ПАРОЛЬ');
await cabinet.auth();

// Отримати анкетні дані викладача
const data = await cabinet.getData();
console.log('ПІБ:', data.fullName);
console.log('Кафедра:', data.department);
console.log('Навантаження:', data.totalWorkload);
```

---

### Робота з академічними групами

```ts
const cabinet = new CabinetTeacher('ЛОГІН', 'ПАРОЛЬ');
await cabinet.auth();

// Отримати всі академічні групи
const groups = await cabinet.getAcademicGroups();
console.log('Академічні групи:', groups);

// Інформація зберігається в об'єкті
console.log('Групи викладача:', cabinet.academicGroups);

// Приклад даних групи:
//   {
//     name: '46Бд-Комп',
//     semester: 1,
//     encodedName: '46%C1%E4-%CA%EE%EC%EF',
//     course: 4,
//     specialty: '122 Комп`ютерні науки (Д_Б 2022-2023 н.р.)',
//     faculty: 'Фізико-математичний факультет',
//     teacherId: '1466',
//     journalUrl: './teachers.cgi?sesID={sesID}&n=1&grp=46%C1%E4-%CA%EE%EC%EF&teacher=1466'
//   },
```

---

### Отримання всіх даних викладача

```ts
const cabinet = new CabinetTeacher('ЛОГІН', 'ПАРОЛЬ');
await cabinet.auth();

// Завантажити всі дані (анкетні дані + академічні групи)
await cabinet.loadData();

console.log('Дані викладача:', cabinet.data);
console.log('Академічні групи:', cabinet.academicGroups);
```

---

### Відновлення сесії викладача

```ts
const cabinet = new CabinetTeacher('ЛОГІН', 'ПАРОЛЬ');

// Відновити попередню сесію
const sesID = 'YOUR_SESSION_ID';
const sessGUID = 'YOUR_SESSION_GUID';

const sessionValid = await cabinet.setSession(sesID, sessGUID);
if (sessionValid) {
    console.log('Сесію відновлено!');
    await cabinet.loadData();
}
```

---

## Документація

📘 API-документація (TypeDoc):
[https://nicita-3.github.io/zdu-student-api](https://nicita-3.github.io/zdu-student-api)

---

## Ліцензія

MIT © 2026
