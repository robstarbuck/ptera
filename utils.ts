import { MILLISECONDS_IN_DAY } from "./constants.ts";
import { DateInfo, OptionalNumber } from "./types.ts";

export function dateInfoToArray(
  dateInfo: DateInfo,
  option?: { jsMonth: boolean },
): [
  number,
  number,
  OptionalNumber,
  OptionalNumber,
  OptionalNumber,
  OptionalNumber,
  OptionalNumber,
] {
  const { year, month, day, hours, minutes, seconds, milliseconds } = dateInfo;
  return [
    year,
    option?.jsMonth ? month - 1 : month,
    day ?? 0,
    hours ?? 0,
    minutes ?? 0,
    seconds ?? 0,
    milliseconds ?? 0,
  ];
}

export function dateInfoToTS(dateInfo: DateInfo) {
  return Date.UTC(...dateInfoToArray(dateInfo, { jsMonth: true }));
}

export function dateInfoToJSDate(
  date: DateInfo,
): Date {
  return new Date(dateInfoToTS(date));
}

export function jsDateToDateInfo(jsDate: Date): DateInfo {
  return {
    year: jsDate.getUTCFullYear(),
    month: jsDate.getUTCMonth() + 1,
    day: jsDate.getUTCDate(),
    hours: jsDate.getUTCHours(),
    minutes: jsDate.getUTCMinutes(),
    seconds: jsDate.getUTCSeconds(),
    milliseconds: jsDate.getUTCMilliseconds(),
  };
}

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function daysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

export function daysInMonth(year: number, month: number): number {
  if (month == 2) {
    return isLeapYear(year) ? 29 : 28;
  } else {
    return [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  }
}

export function weeksInWeekYear(year: number) {
  const p1 = (year +
      Math.floor(year / 4) -
      Math.floor(year / 100) +
      Math.floor(year / 400)) %
      7,
    last = year - 1,
    p2 = (last + Math.floor(last / 4) - Math.floor(last / 100) +
      Math.floor(last / 400)) % 7;
  return p1 === 4 || p2 === 3 ? 53 : 52;
}

export function isBetween(n: number, min: number, max: number): boolean {
  return min <= n && n <= max;
}

export function isValidDate(dateInfo: DateInfo): boolean {
  const { year, month, day, hours, minutes, seconds, milliseconds } = dateInfo;

  const isValidMonth = isBetween(month, 1, 12);
  if (!isValidMonth) return false;

  if (day) {
    const isValidDay = isBetween(day, 1, daysInMonth(year, month));
    if (!isValidDay) return false;
  }

  if (hours) {
    const isValidHour = isBetween(hours, 1, 23) ||
      (hours === 24 && minutes === 0 && seconds === 0 && milliseconds === 0);
    if (!isValidHour) return false;
  }

  if (minutes) {
    const isValidMinutes = isBetween(minutes, 0, 59);
    if (!isValidMinutes) return false;
  }

  if (seconds) {
    const isValidSeconds = isBetween(seconds, 0, 59);
    if (!isValidSeconds) return false;
  }

  if (milliseconds) {
    const isValidMilliseconds = isBetween(milliseconds, 0, 999);
    if (!isValidMilliseconds) return false;
  }

  return true;
}

export function parseInteger(value: string | undefined): number | undefined {
  if (!value) return undefined;
  return parseInt(value, 10);
}

export function formatToTwoDigits(n: number): string {
  return n <= 9 ? `0${n}` : n.toString();
}

export function formatToThreeDigits(n: number): string {
  if (n <= 9) return `00${n}`;
  if (n <= 99) return `0${n}`;
  return n.toString();
}

export function dayOfYear(dateInfo: DateInfo): number {
  const jsDate = dateInfoToJSDate(dateInfo);
  const utc = jsDate.getTime();

  jsDate.setUTCMonth(0, 1);
  jsDate.setUTCHours(0, 0, 0, 0);
  const startOfYear = jsDate.getTime();

  const diff = utc - startOfYear;
  return Math.floor(diff / MILLISECONDS_IN_DAY) + 1;
}

export function dayOfWeek(dateInfo: DateInfo): number {
  const jsDate = dateInfoToJSDate(dateInfo);
  const jsWeekNumber = jsDate.getUTCDay();
  if (jsWeekNumber === 0) return 7;
  return jsWeekNumber;
}

export function weeksOfYear(year: number): number {
  const p1 = (year +
      Math.floor(year / 4) -
      Math.floor(year / 100) +
      Math.floor(year / 400)) %
      7,
    last = year - 1,
    p2 = (last + Math.floor(last / 4) - Math.floor(last / 100) +
      Math.floor(last / 400)) % 7;
  return p1 === 4 || p2 === 3 ? 53 : 52;
}
