import { Schedule, scheduleErrors } from './index.js';
import { getGroups } from './utility/groups.js';
import { getRooms } from './utility/rooms.js';
import { getTeachers } from './utility/teachers.js';
import { Audience } from './audience.js';
import { getTypesAudience } from './utility/types-audience.js';
import { getDops } from './utility/dops.js';
import { getQuestionnaireData, getSesId } from './cabinet/index.js';

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

// const audience = new Audience();
// audience.blockName = "гуртож №3"
// try {
//     const audiences = await audience.getAudience();
//     console.log("Аудиторії:", audiences);
// } catch (err: any) {
//     console.error(err.message);
// }

// console.log((await getTypesAudience('Ле')));

//console.log((await getDops()));

// console.log((await getSesId("FFFFF", "123456789")))
const { sesID, sessGUID } = await getSesId('LOGIN', 'PASSWORD');
const data = await getQuestionnaireData(sesID, sessGUID);
console.log(data);
