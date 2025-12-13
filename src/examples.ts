import { stringify } from "querystring";
import { Schedule, scheduleErrors } from "./index.ts";
import { getGroups } from "./utility/groups.ts";
import { getRooms } from "./utility/rooms.ts";
import { getTeachers } from "./utility/teachers.ts";
import { Audience } from "./audience.ts";
import { getTypesAudience } from "./utility/types-audience.ts";
import { getDops } from "./utility/dops.ts";
import { getSesId } from "./cabinet/index.ts";

// const schedule = new Schedule();
// schedule.group = '23Бд-СОінф123'
// schedule.type = 'group'
// schedule.rosText = true;
// //schedule.beginDate.setMonth(schedule.beginDate.getMonth() - 1);
// schedule.allStreamComponents = true;
// try {
//     const sc = await schedule.getSchedule();
//     console.log("Розклад:", sc);
// } catch (err: any) {
//     console.error(err.message);
//     console.error(scheduleErrors[JSON.parse(err.message).errorcode]);
// }

// schedule.roomId = 35
// schedule.type = 'room'
// schedule.rosText = true;
// //schedule.beginDate.setMonth(schedule.beginDate.getMonth() - 1);
// schedule.allStreamComponents = true;
// try {
//     const sc = await schedule.getSchedule();
//     console.log("Розклад:", sc);
// } catch (err: any) {
//     console.error(err.message);
// }

//console.log((await getGroups('25Бд-Комп'))) // -3158
// console.log((await getTeachers('Кривонос Олександр')))
// console.log((await getRooms('319')))


const audience = new Audience();
audience.blockName = "гуртож №3"
try {
    const audiences = await audience.getAudience();
    console.log("Аудиторії:", audiences);
} catch (err: any) {
    console.error(err.message);
}

// console.log((await getTypesAudience('Ле')));

//console.log((await getDops()));

// console.log((await getSesId("FFFFF", "123456789")))