import { MILLISECONDS_IN_DAY } from "./constants.ts";
import { adjustedUnixTimeStamp } from "./diff.ts";
import { DateInfo } from "./types.ts";
import { isLeapYear } from "./utils.ts";

export function dateToArray(
  dateInfo: DateInfo,
  option?: { jsMonth: boolean },
): [
  number,
  number,
  Partial<number>,
  Partial<number>,
  Partial<number>,
  Partial<number>,
  Partial<number>,
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

export function dateToTS(dateInfo: DateInfo): number {
  return Date.UTC(...dateToArray(dateInfo, { jsMonth: true }));
}

export function dateToJSDate(
  date: DateInfo,
): Date {
  return new Date(dateToTS(date));
}

export function jsDateToDate(jsDate: Date): DateInfo {
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

export function dateArrayToDate(dateArray: number[]): DateInfo {
  const year = dateArray[0];
  const month = dateArray[1];
  const day = dateArray[2];
  const hours = dateArray[3];
  const minutes = dateArray[4];
  const seconds = dateArray[5];
  const milliseconds = dateArray[6];
  return { year, month, day, hours, minutes, seconds, milliseconds };
}

export function tsToDate(ts: number): DateInfo {
  const date = new Date(ts);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
    seconds: date.getUTCSeconds(),
    milliseconds: date.getUTCMilliseconds(),
  };
}

export function dayOfYearToDate(dayOfYear: number, year: number) {
  const ts = adjustedUnixTimeStamp({ year, month: 1, day: 1 }, {
    day: dayOfYear - 1,
  }, { positive: true });
  return tsToDate(ts);
}

export function dateToWeekNumber(dateInfo: DateInfo): number {
  const jsDate = dateToJSDate(dateInfo);
  const jsWeekNumber = jsDate.getUTCDay();
  if (jsWeekNumber === 0) return 7;
  return jsWeekNumber;
}

export function dateToDayOfYear(dateInfo: DateInfo): number {
  const jsDate = dateToJSDate(dateInfo);
  const utc = jsDate.getTime();

  jsDate.setUTCMonth(0, 1);
  jsDate.setUTCHours(0, 0, 0, 0);
  const startOfYear = jsDate.getTime();

  const diff = utc - startOfYear;
  return Math.floor(diff / MILLISECONDS_IN_DAY) + 1;
}

export function ordinalToDate(year: number, ordinal: number): DateInfo {
  const nonLeapFirstDayOfMonth = [
    0,
    31,
    59,
    90,
    120,
    151,
    181,
    212,
    243,
    273,
    304,
    334,
  ];

  const leapFirstDayOfMonth = [
    0,
    31,
    60,
    91,
    121,
    152,
    182,
    213,
    244,
    274,
    305,
    335,
  ];

  const table = isLeapYear(year) ? leapFirstDayOfMonth : nonLeapFirstDayOfMonth;
  const monthIndex = table.map((i) => i < ordinal).lastIndexOf(true);
  const day = ordinal - table[monthIndex];
  return { year, month: monthIndex + 1, day };
}