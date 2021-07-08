import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import {
  DateTime,
  datetime,
  diffInDays,
  diffInHours,
  diffInMillisec,
  diffInMin,
  diffInSec,
  latestDateTime,
  oldestDateTime,
} from "./datetime.ts";
import { Timezone } from "./types.ts";

Deno.test("parseISO", () => {
  const tests = [
    {
      input: "2021-01-01",
      expected: {
        year: 2021,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
    },
    {
      input: "2021-01-01T12:30:30.000Z",
      expected: {
        year: 2021,
        month: 1,
        day: 1,
        hour: 12,
        minute: 30,
        second: 30,
        millisecond: 0,
      },
    },
    {
      input: "2021-01-01T12:30:30.000+09:00",
      expected: {
        year: 2021,
        month: 1,
        day: 1,
        hour: 3,
        minute: 30,
        second: 30,
        millisecond: 0,
      },
    },
  ];

  tests.forEach((t) => {
    assertEquals(
      datetime(t.input).toDateObj(),
      t.expected,
    );
  });
});

Deno.test("isValidZone", () => {
  const tests = [
    { input: "Asia/Tokyo", expected: true },
    { input: "Fantasia/Castle", expected: false },
    { input: "America/New_York", expected: true },
    { input: "dummy", expected: false },
    { input: "Osaka", expected: false },
  ];

  tests.forEach((t) => {
    assertEquals(
      datetime("202101", { timezone: t.input }).isValidZone(),
      t.expected,
    );
  });
});

Deno.test("isValid", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: true },
    { input: { year: 2020, month: 2, day: 29 }, expected: true },
    { input: { year: 2021, month: 2, day: 29 }, expected: false },
    { input: { year: 2021, month: 4, day: 31 }, expected: false },
    { input: { year: 2021, month: 11, day: 31 }, expected: false },
  ];

  tests.forEach((t) => {
    assertEquals(datetime(t.input).isValid(), t.expected);
  });
});

Deno.test("toDateObj", () => {
  const tests = [
    {
      stringInput: datetime("2021-01-01T12:30:30.000Z"),
      dateObjInput: datetime({
        year: 2021,
        month: 1,
        day: 1,
        hour: 12,
        minute: 30,
        second: 30,
        millisecond: 0,
      }),
      expected: {
        year: 2021,
        month: 1,
        day: 1,
        hour: 12,
        minute: 30,
        second: 30,
        millisecond: 0,
      },
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.stringInput.toDateObj(), t.expected);
    assertEquals(t.dateObjInput.toDateObj(), t.expected);
  });
});

Deno.test("now", () => {
  const tests = [
    {
      input: DateTime.now(),
      jsDate: new Date(),
    },
  ];

  tests.forEach((t) => {
    assertEquals(
      (t.input.toJSDate().getTime() - t.jsDate.getTime()) < 1000,
      true,
    );
  });
});

Deno.test("toUTC", () => {
  const tests = [
    {
      input: datetime("2021-01-01T12:30:30.000Z", {
        timezone: "Asia/Tokyo",
      }),
      expected: {
        year: 2021,
        month: 1,
        day: 1,
        hour: 3,
        minute: 30,
        second: 30,
        millisecond: 0,
      },
    },
    {
      input: datetime("2021-01-01T12:30:30.000Z", {
        timezone: "America/New_York",
      }),
      expected: {
        year: 2021,
        month: 1,
        day: 1,
        hour: 17,
        minute: 30,
        second: 30,
        millisecond: 0,
      },
    },
    {
      input: datetime("2021-05-15T12:30:30.000Z", {
        timezone: "America/New_York",
      }),
      expected: {
        year: 2021,
        month: 5,
        day: 15,
        hour: 16,
        minute: 30,
        second: 30,
        millisecond: 0,
      },
    },
    {
      input: datetime("2021-05-15T12:30:30.000Z", {
        timezone: "UTC",
      }),
      expected: {
        year: 2021,
        month: 5,
        day: 15,
        hour: 12,
        minute: 30,
        second: 30,
        millisecond: 0,
      },
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input.toUTC().toDateObj(), t.expected);
  });
});

Deno.test("offsetMillisec", () => {
  const tests = [
    {
      input: datetime("2021-01-01T12:30:30.000Z", {
        timezone: "Asia/Tokyo",
      }),
      expected: 32400000,
    },
    {
      input: datetime("2021-01-01T12:30:30.000Z", {
        timezone: "America/New_York",
      }),
      expected: -18000000,
    },
    {
      input: datetime("2021-05-15T12:30:30.000Z", {
        timezone: "America/New_York",
      }),
      expected: -14400000,
    },
    {
      input: datetime("2021-05-15T12:30:30.000Z", { timezone: "UTC" }),
      expected: 0,
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input.offsetMillisec(), t.expected);
  });
});

Deno.test("offsetSec", () => {
  const tests = [
    {
      input: datetime("2021-01-01T12:30:30.000Z", {
        timezone: "Asia/Tokyo",
      }),
      expected: 32400,
    },
    {
      input: datetime("2021-01-01T12:30:30.000Z", {
        timezone: "America/New_York",
      }),
      expected: -18000,
    },
    {
      input: datetime("2021-05-15T12:30:30.000Z", {
        timezone: "America/New_York",
      }),
      expected: -14400,
    },
    {
      input: datetime("2021-05-15T12:30:30.000Z", { timezone: "UTC" }),
      expected: 0,
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input.offsetSec(), t.expected);
  });
});

Deno.test("offsetMin", () => {
  const tests = [
    {
      input: datetime("2021-01-01T12:30:30.000Z", {
        timezone: "Asia/Tokyo",
      }),
      expected: 540,
    },
    {
      input: datetime("2021-01-01T12:30:30.000Z", {
        timezone: "America/New_York",
      }),
      expected: -300,
    },
    {
      input: datetime("2021-05-15T12:30:30.000Z", {
        timezone: "America/New_York",
      }),
      expected: -240,
    },
    {
      input: datetime("2021-05-15T12:30:30.000Z", { timezone: "UTC" }),
      expected: 0,
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input.offsetMin(), t.expected);
  });
});

Deno.test("offsetHour", () => {
  const tests = [
    {
      input: datetime("2021-01-01T12:30:30.000Z", {
        timezone: "Asia/Tokyo",
      }),
      expected: 9,
    },
    {
      input: datetime("2021-01-01T12:30:30.000Z", {
        timezone: "America/New_York",
      }),
      expected: -5,
    },
    {
      input: datetime("2021-05-15T12:30:30.000Z", {
        timezone: "America/New_York",
      }),
      expected: -4,
    },
    {
      input: datetime("2021-05-15T12:30:30.000Z", { timezone: "UTC" }),
      expected: 0,
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input.offsetHour(), t.expected);
  });
});

Deno.test("toZonedTime", () => {
  type Test = {
    input: DateTime;
    tz: Timezone;
    expected: DateTime;
  };
  const tests: Test[] = [
    {
      input: datetime("2021-01-01T12:30:30.000Z", {
        timezone: "Asia/Tokyo",
      }),
      tz: "America/New_York",
      expected: datetime("2020-12-31T22:30:30.000Z", {
        timezone: "America/New_York",
      }),
    },
    {
      input: datetime("2021-01-01T12:30:30.000Z", {
        timezone: "UTC",
      }),
      tz: "Asia/Tokyo",
      expected: datetime("2021-01-01T21:30:30.000Z", {
        timezone: "Asia/Tokyo",
      }),
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input.toZonedTime(t.tz).timezone, t.expected.timezone);
    assertEquals(
      t.input.toZonedTime(t.tz).toDateObj(),
      t.expected.toDateObj(),
    );
  });
});

Deno.test("toJSDate", () => {
  type Test = {
    input: DateTime;
    expected: Date;
  };
  const tests: Test[] = [
    {
      input: datetime("2021-01-01T12:30:30.000Z"),
      expected: new Date(Date.UTC(2021, 0, 1, 12, 30, 30, 0)),
    },
    {
      input: datetime("2021-05-15T21:30:30.000Z"),
      expected: new Date(Date.UTC(2021, 4, 15, 21, 30, 30, 0)),
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input.toJSDate(), t.expected);
  });
});

Deno.test("toISODate", () => {
  type Test = {
    input: DateTime;
    expected: string;
  };
  const tests: Test[] = [
    {
      input: datetime({
        year: 2021,
        month: 5,
        day: 15,
        hour: 12,
        minute: 30,
        second: 30,
        millisecond: 0,
      }),
      expected: "2021-05-15",
    },
    {
      input: datetime({
        year: 2021,
        month: 7,
        day: 21,
        hour: 12,
        minute: 30,
        second: 30,
        millisecond: 0,
      }),
      expected: "2021-07-21",
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input.toISODate(), t.expected);
  });
});

Deno.test("toISOWeekDate", () => {
  type Test = {
    input: DateTime;
    expected: string;
  };
  const tests: Test[] = [
    {
      input: datetime({
        year: 2021,
        month: 5,
        day: 15,
        hour: 12,
        minute: 30,
        second: 30,
        millisecond: 999,
      }),
      expected: "2021-W19-6",
    },
    {
      input: datetime({
        year: 2021,
        month: 7,
        day: 21,
        hour: 23,
        minute: 0,
        second: 59,
        millisecond: 0,
      }),
      expected: "2021-W29-3",
    },
    {
      input: datetime({
        year: 2021,
        month: 1,
        day: 1,
        hour: 23,
        minute: 0,
        second: 59,
        millisecond: 0,
      }),
      expected: "2021-W53-5",
    },
    {
      input: datetime({
        year: 2021,
        month: 12,
        day: 31,
        hour: 23,
        minute: 0,
        second: 59,
        millisecond: 0,
      }),
      expected: "2021-W52-5",
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input.toISOWeekDate(), t.expected);
  });
});

Deno.test("toISOTime", () => {
  type Test = {
    input: DateTime;
    expected: string;
  };
  const tests: Test[] = [
    {
      input: datetime({
        year: 2021,
        month: 5,
        day: 15,
        hour: 12,
        minute: 30,
        second: 30,
        millisecond: 999,
      }),
      expected: "12:30:30.999",
    },
    {
      input: datetime({
        year: 2021,
        month: 7,
        day: 21,
        hour: 23,
        minute: 0,
        second: 59,
        millisecond: 0,
      }),
      expected: "23:00:59.000",
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input.toISOTime(), t.expected);
  });
});

Deno.test("toISO", () => {
  type Test = {
    input: DateTime;
    expected: string;
  };
  const tests: Test[] = [
    {
      input: datetime({
        year: 2021,
        month: 5,
        day: 15,
        hour: 12,
        minute: 30,
        second: 30,
        millisecond: 999,
      }),
      expected: "2021-05-15T12:30:30.999Z",
    },
    {
      input: datetime({
        year: 2021,
        month: 7,
        day: 21,
        hour: 23,
        minute: 0,
        second: 59,
        millisecond: 0,
      }, { timezone: "Asia/Tokyo" }),
      expected: "2021-07-21T23:00:59.000+09:00",
    },
    {
      input: datetime({
        year: 2021,
        month: 7,
        day: 21,
        hour: 23,
        minute: 0,
        second: 59,
        millisecond: 0,
      }, { timezone: "America/New_York" }),
      expected: "2021-07-21T23:00:59.000-04:00",
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input.toISO(), t.expected);
  });
});

Deno.test("toArray", () => {
  const tests = [
    { input: "2021-07-21", expected: [2021, 7, 21, 0, 0, 0, 0] },
    { input: "2021-07-21T23:00:59", expected: [2021, 7, 21, 23, 0, 59, 0] },
    {
      input: "2021-07-21T23:15:59.999",
      expected: [2021, 7, 21, 23, 15, 59, 999],
    },
    {
      input: "2021-07-21T23:15:59.999Z",
      expected: [2021, 7, 21, 23, 15, 59, 999],
    },
    {
      input: "2021-07-21T23:00:59.000Z",
      expected: [2021, 7, 21, 23, 0, 59, 0],
    },
  ];
  tests.forEach((t) => {
    assertEquals(datetime(t.input).toArray(), t.expected);
  });
});

Deno.test("toTimestamp", () => {
  const tests = [
    {
      input: "2021-05-30T06:03:40",
      expected: 1622354620000,
    },
    { input: "2021-07-21T23:00:59", expected: 1626908459000 },
  ];
  tests.forEach((t) => {
    assertEquals(datetime(t.input).toTimestamp(), t.expected);
  });
});

Deno.test("weeksInWeekYear", () => {
  const tests = [
    { input: "2021-01-01", expected: 52 },
    { input: "2020-12-31", expected: 53 },
  ];
  tests.forEach((t) => {
    assertEquals(datetime(t.input).weeksInWeekYear(), t.expected);
  });
});

Deno.test("dayOfYear", () => {
  const tests = [
    { input: "2021-01-01", expected: 1 },
    { input: "2021-02-23", expected: 54 },
    { input: "2021-12-31", expected: 365 },
    { input: "2020-12-31", expected: 366 },
  ];
  tests.forEach((t) => {
    assertEquals(datetime(t.input).dayOfYear(), t.expected);
  });
});

Deno.test("add", () => {
  const tests = [
    {
      initialDate: "2021-05-31T23:00:00",
      addDate: { year: 1 },
      expected: {
        year: 2022,
        month: 5,
        day: 31,
        hour: 23,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
    },
    {
      initialDate: "2021-05-31T23:00:00",
      addDate: { month: 1 },
      expected: {
        year: 2021,
        month: 6,
        day: 30,
        hour: 23,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
    },
    {
      initialDate: "2021-02-01T23:00:00",
      addDate: { hour: 1 },
      expected: {
        year: 2021,
        month: 2,
        day: 2,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
    },
    {
      initialDate: "2021-02-01T23:00:00",
      addDate: { minute: 65 },
      expected: {
        year: 2021,
        month: 2,
        day: 2,
        hour: 0,
        minute: 5,
        second: 0,
        millisecond: 0,
      },
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      datetime(t.initialDate).add(t.addDate).toDateObj(),
      t.expected,
    );
  });
});

Deno.test("substract", () => {
  const tests = [
    {
      initialDate: "2021-02-01T23:00:00",
      subDate: { year: 20 },
      expected: {
        year: 2001,
        month: 2,
        day: 1,
        hour: 23,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
    },
    {
      initialDate: "2021-02-28T23:00:00",
      subDate: { month: 2 },
      expected: {
        year: 2020,
        month: 12,
        day: 28,
        hour: 23,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
    },
    {
      initialDate: "2021-02-01T23:00:00",
      subDate: { day: 1 },
      expected: {
        year: 2021,
        month: 1,
        day: 31,
        hour: 23,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      datetime(t.initialDate).substract(t.subDate).toDateObj(),
      t.expected,
    );
  });
});

Deno.test("diffInDays", () => {
  const tests = [
    {
      baseDate: "2021-02-01T23:00:00",
      compareDate: "2021-02-02T23:00:00",
      expected: 1,
    },
    {
      baseDate: "2021-02-01T23:00:00",
      compareDate: "2021-03-01T23:00:00",
      expected: 28,
    },
    {
      baseDate: "2021-01-01T23:00:00",
      compareDate: "2021-12-31T23:00:00",
      expected: 364,
    },
    {
      baseDate: "2020-01-01T23:00:00",
      compareDate: "2020-12-31T23:00:00",
      expected: 365,
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      diffInDays(
        datetime(t.baseDate),
        datetime(t.compareDate),
      ),
      t.expected,
    );
  });
});

Deno.test("diffInHours", () => {
  const tests = [
    {
      baseDate: "2021-02-01T23:00:00",
      compareDate: "2021-02-02T23:00:00",
      expected: 24,
    },
    {
      baseDate: "2021-02-01T00:00:00",
      compareDate: "2021-02-03T02:00:00",
      expected: 50,
    },
    {
      baseDate: "2021-01-01T00:00:00",
      compareDate: "2021-01-01T02:00:00",
      expected: 2,
    },
    {
      baseDate: "2021-01-01T00:00:00",
      compareDate: "2021-01-01T00:30:00",
      expected: 0,
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      diffInHours(
        datetime(t.baseDate),
        datetime(t.compareDate),
      ),
      t.expected,
    );
  });
});

Deno.test("diffInMin", () => {
  const tests = [
    {
      baseDate: "2021-02-01T23:00:00",
      compareDate: "2021-02-02T23:00:00",
      expected: 1440,
    },
    {
      baseDate: "2021-02-01T00:00:00",
      compareDate: "2021-02-01T02:30:00",
      expected: 150,
    },
    {
      baseDate: "2021-01-01T00:00:00",
      compareDate: "2021-01-01T00:30:59",
      expected: 30,
    },
    {
      baseDate: "2021-01-01T00:00:00",
      compareDate: "2021-01-01T02:30:30",
      expected: 150,
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      diffInMin(
        datetime(t.baseDate),
        datetime(t.compareDate),
      ),
      t.expected,
    );
  });
});

Deno.test("diffInSec", () => {
  const tests = [
    {
      baseDate: "2021-02-01T23:00:00",
      compareDate: "2021-02-01T23:00:50",
      expected: 50,
    },
    {
      baseDate: "2021-02-01T00:00:00",
      compareDate: "2021-02-01T00:30:00",
      expected: 1800,
    },
    {
      baseDate: "2021-01-01T00:00:00",
      compareDate: "2021-01-01T00:30:59",
      expected: 1859,
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      diffInSec(
        datetime(t.baseDate),
        datetime(t.compareDate),
      ),
      t.expected,
    );
  });
});

Deno.test("diffInMillisec", () => {
  const tests = [
    {
      baseDate: "2021-02-01T23:00:00",
      compareDate: "2021-02-01T23:00:50.999",
      expected: 50999,
    },
    {
      baseDate: "2021-02-01T00:00:00",
      compareDate: "2021-02-01T00:30:00.100",
      expected: 1800100,
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      diffInMillisec(
        datetime(t.baseDate),
        datetime(t.compareDate),
      ),
      t.expected,
    );
  });
});

Deno.test("oldestDateTime", () => {
  const tests = [
    {
      first: "2021-02-01T10:00:00",
      second: "2021-02-01T20:00:50.999",
      third: "2021-02-01T23:00:50.999",
    },
  ];
  tests.forEach((t) => {
    const min = oldestDateTime(
      [
        datetime(t.first),
        datetime(t.second),
        datetime(t.third),
      ],
    );
    assertEquals(
      min.toDateObj(),
      datetime(t.first).toDateObj(),
    );
  });
});

Deno.test("latestDateTime", () => {
  const tests = [
    {
      first: "2021-02-01T10:00:00",
      second: "2021-02-01T20:00:50.999",
      third: "2021-02-01T23:00:50.999",
    },
  ];
  tests.forEach((t) => {
    const max = latestDateTime(
      [
        datetime(t.first),
        datetime(t.second),
        datetime(t.third),
      ],
    );
    assertEquals(
      max.toDateObj(),
      datetime(t.third).toDateObj(),
    );
  });
});

Deno.test("startOf year", () => {
  const tests = [
    { input: "2021-07-28T12:30:30.800Z", expected: "2021-01-01T00:00:00.000Z" },
  ];

  tests.forEach((t) => {
    assertEquals(
      datetime(t.input).startOf("year").toISO(),
      t.expected,
    );
  });
});

Deno.test("startOf quarter", () => {
  const tests = [
    { input: "2021-03-28T12:30:30.800Z", expected: "2021-01-01T00:00:00.000Z" },
    { input: "2021-05-28T12:30:30.800Z", expected: "2021-04-01T00:00:00.000Z" },
    { input: "2021-07-28T12:30:30.800Z", expected: "2021-07-01T00:00:00.000Z" },
    { input: "2021-11-28T12:30:30.800Z", expected: "2021-10-01T00:00:00.000Z" },
  ];

  tests.forEach((t) => {
    assertEquals(
      datetime(t.input).startOf("quarter").toISO(),
      t.expected,
    );
  });
});

Deno.test("startOf month", () => {
  const tests = [
    { input: "2021-07-28T12:30:30.800Z", expected: "2021-07-01T00:00:00.000Z" },
  ];

  tests.forEach((t) => {
    assertEquals(
      datetime(t.input).startOf("month").toISO(),
      t.expected,
    );
  });
});

Deno.test("startOf day", () => {
  const tests = [
    { input: "2021-07-28T12:30:30.800Z", expected: "2021-07-28T00:00:00.000Z" },
  ];

  tests.forEach((t) => {
    assertEquals(
      datetime(t.input).startOf("day").toISO(),
      t.expected,
    );
  });
});

Deno.test("startOf hour", () => {
  const tests = [
    { input: "2021-07-28T12:30:30.800Z", expected: "2021-07-28T12:00:00.000Z" },
  ];

  tests.forEach((t) => {
    assertEquals(
      datetime(t.input).startOf("hour").toISO(),
      t.expected,
    );
  });
});

Deno.test("startOf minute", () => {
  const tests = [
    { input: "2021-07-28T12:30:30.800Z", expected: "2021-07-28T12:30:00.000Z" },
  ];

  tests.forEach((t) => {
    assertEquals(
      datetime(t.input).startOf("minute").toISO(),
      t.expected,
    );
  });
});

Deno.test("startOf second", () => {
  const tests = [
    { input: "2021-07-28T12:30:30.800Z", expected: "2021-07-28T12:30:30.000Z" },
  ];

  tests.forEach((t) => {
    assertEquals(
      datetime(t.input).startOf("second").toISO(),
      t.expected,
    );
  });
});

Deno.test("endOf year", () => {
  const tests = [
    { input: "2021-07-28T12:30:30.800Z", expected: "2021-12-31T23:59:59.999Z" },
  ];

  tests.forEach((t) => {
    assertEquals(
      datetime(t.input).endOf("year").toISO(),
      t.expected,
    );
  });
});

Deno.test("endOf quarter", () => {
  const tests = [
    { input: "2021-03-28T12:30:30.800Z", expected: "2021-03-31T23:59:59.999Z" },
    { input: "2021-05-28T12:30:30.800Z", expected: "2021-06-30T23:59:59.999Z" },
    { input: "2021-07-28T12:30:30.800Z", expected: "2021-09-30T23:59:59.999Z" },
    { input: "2021-11-28T12:30:30.800Z", expected: "2021-12-31T23:59:59.999Z" },
  ];

  tests.forEach((t) => {
    assertEquals(
      datetime(t.input).endOf("quarter").toISO(),
      t.expected,
    );
  });
});

Deno.test("endOf month", () => {
  const tests = [
    { input: "2021-07-28T12:30:30.800Z", expected: "2021-07-31T23:59:59.999Z" },
  ];

  tests.forEach((t) => {
    assertEquals(
      datetime(t.input).endOf("month").toISO(),
      t.expected,
    );
  });
});

Deno.test("endOf day", () => {
  const tests = [
    { input: "2021-07-28T12:30:30.800Z", expected: "2021-07-28T23:59:59.999Z" },
  ];

  tests.forEach((t) => {
    assertEquals(
      datetime(t.input).endOf("day").toISO(),
      t.expected,
    );
  });
});

Deno.test("endOf hour", () => {
  const tests = [
    { input: "2021-07-28T12:30:30.800Z", expected: "2021-07-28T12:59:59.999Z" },
  ];

  tests.forEach((t) => {
    assertEquals(
      datetime(t.input).endOf("hour").toISO(),
      t.expected,
    );
  });
});

Deno.test("endOf minute", () => {
  const tests = [
    { input: "2021-07-28T12:30:30.800Z", expected: "2021-07-28T12:30:59.999Z" },
  ];

  tests.forEach((t) => {
    assertEquals(
      datetime(t.input).endOf("minute").toISO(),
      t.expected,
    );
  });
});

Deno.test("endOf second", () => {
  const tests = [
    { input: "2021-07-28T12:30:30.800Z", expected: "2021-07-28T12:30:30.999Z" },
  ];

  tests.forEach((t) => {
    assertEquals(
      datetime(t.input).endOf("second").toISO(),
      t.expected,
    );
  });
});
