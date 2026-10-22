import {
    CabinetStudent,
    Discipline,
    getСurrentDisciplines,
    Schedule,
    scheduleErrors,
} from './index.js';
import { getGroups } from './utility/groups.js';
import { getRooms } from './utility/rooms.js';
import { getTeachers } from './utility/teachers.js';
import { Audience } from './audience.js';
import { getTypesAudience } from './utility/types-audience.js';
import { getDops } from './utility/dops.js';
import { getDisciplines, getScores, getSesId, Scores } from './index.js';
import 'dotenv/config';
import { CabinetTeacher } from './cabinetTeacher/cabinetTeacher.js';
import process from 'node:process';
// import { writeFile } from 'fs/promises';

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

// console.log(await getGroups('25Бд-Комп')); // -3158
// console.log(await getTeachers('Кривонос Олександр'));
// console.log(await getRooms('319'));

// const audience = new Audience();
// // audience.blockName = 'гуртож №3';
// try {
//     audience.roomType = 'Комп. клас';
//     audience.blockName = '№1';
//     const [day, month, year] = '09.02.2026'.split('.');
//     audience.roomsDate = new Date(+year, +month - 1, +day + 1);
//     console.log(audience.roomsDate);
//     audience.lesson = 5;
//     const audiences = await audience.getAudience();

//     console.log('Аудиторії:', audiences);
// } catch (err: any) {
//     console.error(err.message);
// }

// console.log((await getTypesAudience('Ле')));

//console.log((await getDops()));

// console.log((await getSesId("FFFFF", "123456789")))

// console.log(cb.data);
// console.log(cb.disciplines);
// const { sesID, sessGUID } = await getSesId(process.env.LOGIN!, process.env.PASSWORD!);
// console.log(sesID, sessGUID);
// const sesID = '';
// const sessGUID = '';
// const data = await getData(sesID, sessGUID);
// const data = await getDisciplines(sesID, sessGUID);
// const data = await getСurrentDisciplines(sesID, sessGUID);
// console.log(data);
// const data2 = await getScores(sesID, sessGUID, '43910', 1);
// console.log(data2.studentScores);

// const sesID = '';
// const sessGUID = '';

const cb = new CabinetStudent(process.env.LOGIN2!, process.env.PASSWORD2!);
await cb.auth();
console.log(cb.sesID, cb.sessGUID);
await cb.loadData();
console.log(cb.disciplines);
// Оцінки з окремого предмета
const one = await cb.getScores(cb.disciplines[0].prId);
console.log(one.name, one.scheduleItem, one.studentScores);
// Оцінки з усіх предметів (вже завантажені в loadData)
printFinalScores(cb.allScores!);
// console.log(await cb.setSession(sesID, sessGUID));
// // console.log(cb.sesID, cb.sessGUID);
// await cb.loadData();
// const scores = cb.allScores;
// await writeFile('scores.json', JSON.stringify(cb.disciplines, null, 2));

// console.log(cb.data);
function printFinalScores(scoresArray: Scores[]) {
    for (const scoresObj of scoresArray) {
        const s = scoresObj.studentScores;
        console.log(
            `${scoresObj.name ?? scoresObj.prId}: ${s?.finalScore || '-'} (пропусків: ${s?.absences ?? 0}, невиправд.: ${s?.uabsences ?? 0})`,
        );
    }
}

// const sesID = '';
// const sessGUID = '';
// const cb = new CabinetTeacher(process.env.LOGINT!, process.env.PASSWORDT!);
// // console.log(await cb.auth());
// //console.log(cb.sesID, cb.sessGUID);
// console.log(await cb.setSession(sesID, sessGUID));
// console.log(cb.sesID, cb.sessGUID);
// console.log(await cb.loadData());
// console.log(cb.data);
// console.log(cb.academicGroups);
