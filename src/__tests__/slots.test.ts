import moment, { Moment } from "moment";

import { addInterval, Interval, slots } from "../slots";

describe("slots", () => {
  const interval: Interval = { amount: 30, unit: "minutes" };
  const d1 = moment();
  const d2 = addInterval(interval)(d1); // d1 + 30m
  const d3 = addInterval(interval)(d2); // d2 + 30m = d1 + 60m
  const start = d1;

  const geq = (d: Moment) => (c: Moment): boolean => c >= d;

  it("generate a single time slot", () => {
    const gen = slots(interval)([])(start);

    expect(gen.next().value).toEqual([start.format("HH:mm")]);
  });

  it("generate subsequent time slots", () => {
    const gen = slots(interval)([])(start);

    expect(gen.next().value).toEqual([start.format("HH:mm")]);
    expect(gen.next().value).toEqual([addInterval(interval)(start).format("HH:mm")]);
  });

  it("do not generate time slots if constraints always fail", () => {
    const gen = slots(interval)([() => false])(start);

    expect(gen.next().value).toEqual([]);
  });

  it("do not generate time slots if a constraint is failing", () => {
    const gen = slots(interval)([geq(d2)])(start);

    expect(gen.next().value).toEqual([]);
    expect(gen.next().value).toEqual([d2.format("HH:mm")]);
    expect(gen.next().value).not.toEqual([]);
  });

  it("do not generate time slots if costraints are failing", () => {
    const gen = slots(interval)([geq(d2), geq(d3)])(start);

    expect(gen.next().value).toEqual([]);
    expect(gen.next().value).toEqual([]);
    expect(gen.next().value).toEqual([d3.format("HH:mm")]);
    expect(gen.next().value).not.toEqual([]);
  });
});
