import moment, { Moment } from "moment";
import { ge } from "../constraint";

import { Interval, one, slots } from "../slots";
import { addInterval } from "../util";

const interval: Interval = { amount: 30, unit: "minutes" };
const d1 = moment();
const d2 = addInterval(interval)(d1); // d1 + 30m
const d3 = addInterval(interval)(d2); // d2 + 30m = d1 + 60m
const start = d1;

describe("single time slot", () => {
  it("create a time slot", () => {
    expect(one([])(start)).not.toEqual([]);
  });

  it("create first value equal to start", () => {
    expect(one([])(start)).toEqual([start]);
  });

  it("create value when all constraints are true", () => {
    const t = () => true;
    const f = () => false;

    expect(one([])(start)).not.toEqual([]);
    expect(one([t])(start)).not.toEqual([]);
    expect(one([t, t, t])(start)).not.toEqual([]);
    expect(one([t, f])(start)).toEqual([]);
    expect(one([f, t])(start)).toEqual([]);
    expect(one([f, f, f])(start)).toEqual([]);
    expect(one([f])(start)).toEqual([]);
  });
});

describe("time slots generator", () => {
  const alwaysGen = () => slots(interval)([])(start);
  const neverGen = () => slots(interval)([() => false])(start);
  const startFromD2Gen = () => slots(interval)([ge(d2)])(start);
  const startFromD3Gen = () => slots(interval)([ge(d2), ge(d3)])(start);

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
