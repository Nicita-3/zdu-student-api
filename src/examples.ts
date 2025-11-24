import { Schedule } from "./index.ts";
import { getGroups } from "./utility/groups.ts";
import { getRooms } from "./utility/rooms.ts";
import { getTeachers } from "./utility/teachers.ts";

const schedule = new Schedule();
schedule.group = '23Бд-СОінф'
schedule.type = 'group'
schedule.rosText = true;
schedule.allStreamComponents = true;
console.log((await schedule.getSchedule()))

// console.log((await getGroups('23Бд-СОінф')))
// console.log((await getTeachers('Кривонос Олександр')))
// console.log((await getRooms('319')))