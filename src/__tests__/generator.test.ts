import moment, { Moment } from "moment";
import { forEach, KeyValuePair, map, zip } from "ramda";

import { ge, lt } from "../constraint";
import { generator } from "../generator";
import { addInterval, Interval } from "../interval";
import { flatten, takeUntil } from "../util";
import { mock, revive } from "./mock";

const interval: Interval = { amount: 30, unit: "minutes" };
const d1 = moment();
const d2 = addInterval(interval)(d1); // d1 + 30m
const d3 = addInterval(interval)(d2); // d2 + 30m = d1 + 60m
const start = d1;

describe("generator", () => {
  const alwaysGen = () => generator(interval)([])(start);
  const neverGen = () => generator(interval)([() => false])(start);
  const startFromD2Gen = () => generator(interval)([ge(d2)])(start);
  const startFromD3Gen = () => generator(interval)([ge(d2), ge(d3)])(start);

  it("generate a time slot", () => {
    expect(alwaysGen().next().value).not.toBe([]);
  });

  it("generate subsequent time slots", () => {
    const gen = alwaysGen();
    expect(gen.next().value).toEqual([start]);
    expect(gen.next().value).toEqual([addInterval(interval)(start)]);
  });

  it("generate time slots wrt constraints (never)", () => {
    const gen = neverGen();
    expect(gen.next().value).toEqual([]);
    expect(gen.next().value).toEqual([]);
  });

  it("generate time slots wrt constraints (>= d2)", () => {
    const gen = startFromD2Gen();
    expect(gen.next().value).toEqual([]);
    expect(gen.next().value).toEqual([d2]);
    expect(gen.next().value).not.toEqual([]);
  });

  it("generate time slots wrt constraints (>= d2 && => d3)", () => {
    const gen = startFromD3Gen();
    expect(gen.next().value).toEqual([]);
    expect(gen.next().value).toEqual([]);
    expect(gen.next().value).toEqual([d3]);
    expect(gen.next().value).not.toEqual([]);
  });
});

describe("generator with constraints", () => {
  it("generate time slots wrt hourly constraints", () => {
    const dateFormat = "YYYY-MM-DD";
    const datetimeFormat = "YYYY-MM-DD HH:mm";

    const notBefore8am = (c: Moment) =>
      ge(moment(`${c.format(dateFormat)} 8:00`, datetimeFormat))(c);

    const start = moment("2020-10-17 07:00");
    const gen = generator(interval)([notBefore8am])(start);

    expect(gen.next().value).toEqual([]); // 7:00 am
    expect(gen.next().value).toEqual([]); // 7:30 am
    expect(gen.next().value).not.toEqual([]); // 8:00 am, now we can generate
  });

  it("generate time slots wrt daily constraints", () => {
    const notSathurday = (c: Moment) => c.isoWeekday() != 6;
    const start = moment("2020-10-17 23:00"); // it's sathurday

    const gen = generator(interval)([notSathurday])(start);

    expect(gen.next().value).toEqual([]); // 23:00 sathurday
    expect(gen.next().value).toEqual([]); // 23:30 sathurday
    expect(gen.next().value).not.toEqual([]); // 00:00 sunday, now we can generate
  });
});

describe("generator with complex constraints", () => {
  const dateFormat = "YYYY-MM-DD";
  const datetimeFormat = "YYYY-MM-DD HH:mm";

  it("generate a work week calendar with 1h slots", () => {
    const interval: Interval = { amount: 1, unit: "hour" };
    const start = moment("2020-10-11 00:00");
    const stop = moment("2020-10-18 00:00");

    const notOnSathurday = (c: Moment) => c.isoWeekday() !== 6;
    const notOnSunday = (c: Moment) => c.isoWeekday() !== 7;
    const notBefore8am = (c: Moment) =>
      ge(moment(`${c.format(dateFormat)} 8:00`, datetimeFormat))(c);
    const notAtLaunch = (c: Moment) =>
      !c.isBetween(
        moment(`${c.format(dateFormat)} 12:00`, datetimeFormat),
        moment(`${c.format(dateFormat)} 14:00`, datetimeFormat),
        undefined,
        "[)",
      );
    const notAfter18pm = (c: Moment) =>
      lt(moment(`${c.format(dateFormat)} 18:00`, datetimeFormat))(c);

    const gen = generator(interval)([
      notOnSathurday,
      notOnSunday,
      notBefore8am,
      notAfter18pm,
      notAtLaunch,
    ])(start);

    const actualWeek = flatten(takeUntil(stop)(gen));
    const expectedWeek = map(revive, mock.workingWeek);

    forEach((x: KeyValuePair<Moment, Moment>) => {
      expect(x[0].isSame(x[1])).toBe(true);
    }, zip(actualWeek, expectedWeek));
    expect.assertions(actualWeek.length);
  });
});
