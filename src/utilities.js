import { DateTime } from "luxon";

function convertTemp(kelvin, unit, decimal) {
  if (unit === "C") return convertDecimal(kelvin - 273.15, decimal);
  else return convertDecimal(kelvin * (9 / 5) - 459.67, decimal);
}

function convertDecimal(number, decimal) {
  return number.toFixed(decimal);
}

//uses luxon API for custom timezone format
function dateAndTime(timezone) {
  let date = DateTime.fromISO(DateTime.now(), {
    zone: timezone,
  });
  //adds a 0 before single digits minutes
  if (date.c.minute < 10) date.c.minute = "0" + date.c.minute;
  return date;
}

function getDayNightTime(seconds, timezone) {
  let time = DateTime.fromSeconds(seconds, { zone: timezone });
  if (time.c.minute < 10) time.c.minute = "0" + time.c.minute;
  return time;
}

//gets cardinal direction of wind
function getWindDirection(deg) {
  if (deg >= 337.5 || deg < 22.5) return "North";
  if (deg >= 22.5 && deg < 67.5) return "N-E";
  if (deg >= 67.5 && deg < 112.5) return "East";
  if (deg >= 112.5 && deg < 157.5) return "S-E";
  if (deg >= 157.5 && deg < 202.5) return "South";
  if (deg >= 202.5 && deg < 247.5) return "S-W";
  if (deg >= 247.5 && deg < 292.5) return "West";
  if (deg >= 292.5 && deg < 337.5) return "NW";
}
//get next day of week based on input
function getFutureDay(currentDay, days) {
  let today = currentDay;
  for (let i = 0; i < days; i++) {
    if (today === 7) today = 0;
    today += 1;
  }
  return today === 1
    ? "Monday"
    : today === 2
    ? "Tuesday"
    : today === 3
    ? "Wednesday"
    : today === 4
    ? "Thursday"
    : today === 5
    ? "Friday"
    : today === 6
    ? "Saturday"
    : "Sunday";
}
export {
  convertTemp,
  convertDecimal,
  dateAndTime,
  getDayNightTime,
  getFutureDay,
  getWindDirection,
};
