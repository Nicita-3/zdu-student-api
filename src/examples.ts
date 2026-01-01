import { Discipline, getСurrentDisciplines, Schedule, scheduleErrors } from './index.js';
import { getGroups } from './utility/groups.js';
import { getRooms } from './utility/rooms.js';
import { getTeachers } from './utility/teachers.js';
import { Audience } from './audience.js';
import { getTypesAudience } from './utility/types-audience.js';
import { getDops } from './utility/dops.js';
import { getDisciplines, getScores, getSesId, Scores } from './index.js';
import 'dotenv/config';
import { CabinetTeacher } from './cabinetTeacher/cabinetTeacher.js';

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

// console.log(cb.data);
// console.log(cb.disciplines);
// const { sesID, sessGUID } = await getSesId(process.env.LOGIN!, process.env.PASSWORD!);
// console.log(sesID, sessGUID);
// const sesID = '2850142C-AF52-4291-90C6-7EF356F90530';
// const sessGUID = '20225423078dcb37d97904b76ba534af';
// const data = await getData(sesID, sessGUID);
// const data = await getDisciplines(sesID, sessGUID);
// const data = await getСurrentDisciplines(sesID, sessGUID);
// console.log(data);
// const data2 = await getScores(sesID, sessGUID, '43910', 0);
// // console.log(data2);
// const me = data2.studentScores.find((s) => s.id === data2.studentId)!;

// const sesID = '894CF1B8-9FD8-4D44-A83B-FAC11182EA9C';
// const sessGUID = '558ba94ab569d8701b380dbcfcbc3a42';
// const cb = new Cabinet(process.env.LOGIN!, process.env.PASSWORD!);
// // await cb.auth();
// // console.log(cb.sesID, cb.sessGUID);
// console.log(await cb.setSession(sesID, sessGUID));
// // console.log(cb.sesID, cb.sessGUID);
// // console.log(await cb.loadData());
// console.log(await cb.getId());
// // console.log(cb.allScores);
// // printFinalScores(cb.allScores!, cb.disciplines);

// function printFinalScores(scoresArray: Scores[], disciplines: Discipline[]) {
//     // Створюємо мапу prId → name для швидкого доступу
//     const disciplineMap: Record<string, string> = {};
//     for (const d of disciplines) {
//         disciplineMap[d.prId] = d.name;
//     }

//     const result: Record<string, Record<string, string>> = {};

//     for (const scoresObj of scoresArray) {
//         const disciplineId = scoresObj.prId;
//         const disciplineName = disciplineMap[disciplineId] ?? disciplineId;
//         for (const student of scoresObj.studentScores) {
//             if (!result[student.id]) result[student.id] = {};
//             result[student.id][disciplineName] = student.finalScore;
//         }
//     }

//     for (const studentId in result) {
//         console.log(`Student ${studentId}:`);
//         for (const disciplineName in result[studentId]) {
//             console.log(`  ${disciplineName}: ${result[studentId][disciplineName]}`);
//         }
//     }
// }

const sesID = '6AAB1510-0D9F-45FD-9F24-3A7B4568BAA7';
const sessGUID = 'fd09702e51cde3d1bb6bfccdf9fc9e37';
const cb = new CabinetTeacher(process.env.LOGINT!, process.env.PASSWORDT!);
// console.log(await cb.auth());
//console.log(cb.sesID, cb.sessGUID);
console.log(await cb.setSession(sesID, sessGUID));
console.log(cb.sesID, cb.sessGUID);
console.log(await cb.loadData());
console.log(cb.data);
console.log(cb.academicGroups);
