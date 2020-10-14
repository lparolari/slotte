import moment, { Moment } from "moment";
import { ge } from "../constraint";

import { Interval, slots } from "../slots";
import { addInterval } from "../util";

const interval: Interval = { amount: 30, unit: "minutes" };
const d1 = moment();
const d2 = addInterval(interval)(d1); // d1 + 30m
const d3 = addInterval(interval)(d2); // d2 + 30m = d1 + 60m
const start = d1;

describe("slots", () => {
  const geq = (d: Moment) => (c: Moment): boolean => c >= d;

  it("generate a single time slot", () => {
    const gen = slots(interval)([])(start);

    expect(gen.next().value).toEqual([start]);
  });

  it("generate subsequent time slots", () => {
    const gen = slots(interval)([])(start);

    expect(gen.next().value).toEqual([start]);
    expect(gen.next().value).toEqual([addInterval(interval)(start)]);
  });

  it("do not generate time slots if constraints always fail", () => {
    const gen = slots(interval)([() => false])(start);

    expect(gen.next().value).toEqual([]);
  });

  it("do not generate time slots if a constraint is failing", () => {
    const gen = slots(interval)([geq(d2)])(start);

    expect(gen.next().value).toEqual([]);
    expect(gen.next().value).toEqual([d2]);
    expect(gen.next().value).not.toEqual([]);
  });

  it("do not generate time slots if costraints are failing", () => {
    const gen = slots(interval)([geq(d2), geq(d3)])(start);

    expect(gen.next().value).toEqual([]);
    expect(gen.next().value).toEqual([]);
    expect(gen.next().value).toEqual([d3]);
    expect(gen.next().value).not.toEqual([]);
  });
});

describe("slots with constraints", () => {
  it("generate time slots wrt hourly constraints", () => {
    const dateFormat = "YYYY-MM-DD";
    const datetimeFormat = "YYYY-MM-DD HH:mm";

    const notBefore8am = (c: Moment) => ge(moment(`${c.format(dateFormat)} 8:00`, datetimeFormat))(c);

    const start = moment("2020-10-17 07:00");
    const gen = slots(interval)([notBefore8am])(start);

    expect(gen.next().value).toEqual([]); // 7:00 am
    expect(gen.next().value).toEqual([]); // 7:30 am
    expect(gen.next().value).not.toEqual([]); // 8:00 am, now we can generate
  });

  it("generate time slots wrt daily constraints", () => {
    const notSathurday = (c: Moment) => c.isoWeekday() != 6;
    const start = moment("2020-10-17 23:00"); // it's sathurday

    const gen = slots(interval)([notSathurday])(start);

    expect(gen.next().value).toEqual([]); // 23:00 sathurday
    expect(gen.next().value).toEqual([]); // 23:30 sathurday
    expect(gen.next().value).not.toEqual([]); // 00:00 sunday, now we can generate
  });
});
