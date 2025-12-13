# ZDU Student API

API для **Житомирського державного університету імені Івана Франка**.

Бібліотека надає програмний доступ до відкритих сервісів університету, зокрема:

* 📅 розклад занять студентів / викладачів / аудиторій
* 🚪 зайняті / вільні аудиторії
* 🏫 списки аудиторій
* 👥 списки груп
* 👨‍🏫 списки викладачів

### 🔮 У планах

* API кабінету студента
* оцінки
* рейтинги

> ⚠️ Проєкт **не є офіційним** API університету.

---

## Встановлення

```bash
npm install zdu-student-api
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

### Кабінет студента (WIP)

```ts
import { getSesId } from 'zdu-student-api';

const sessionId = await getSesId('LOGIN', 'PASSWORD');
console.log(sessionId);
```

> ⚠️ Функціонал у розробці

---

## Документація

📘 API-документація (TypeDoc):
[https://nicita-3.github.io/zdu-student-api](https://nicita-3.github.io/zdu-student-api)

---

## Ліцензія

MIT © 2025
