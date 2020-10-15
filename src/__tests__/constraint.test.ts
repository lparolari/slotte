import moment, { Moment } from "moment";
import { map } from "ramda";

import {
  eq,
  ge,
  gt,
  le,
  lt,
  ne,
  onFriday,
  onMonday,
  onSathurday,
  onSunday,
  onThursday,
  onTuesday,
  onWednesday,
  validate,
} from "../constraint";
import { addInterval } from "../interval";

describe("validate", () => {
  const c = moment();

  const t = () => true;
  const f = () => false;

  it("return true whether all constraints are true", () => {
    expect(validate([])(c)).toBe(true);
    expect(validate([t])(c)).toBe(true);
    expect(validate([t, t, t])(c)).toBe(true);
    expect(validate([t, f])(c)).toBe(false);
    expect(validate([f, t])(c)).toBe(false);
    expect(validate([f, f, f])(c)).toBe(false);
    expect(validate([f])(c)).toBe(false);
  });
});

describe("comparison constraints", () => {
  const c = moment();
  const equal = c;
  const greater = addInterval({ amount: 1, unit: "hour" })(c);
  const less = addInterval({ amount: -1, unit: "hour" })(c);

  const injectCurrent = (f: (current: Moment) => boolean): boolean => f(c);

  test("lt", () => {
    expect(injectCurrent(lt(equal))).toBe(false);
    expect(injectCurrent(lt(greater))).toBe(true);
    expect(injectCurrent(lt(less))).toBe(false);
  });

  test("le", () => {
    expect(injectCurrent(le(equal))).toBe(true);
    expect(injectCurrent(le(greater))).toBe(true);
    expect(injectCurrent(le(less))).toBe(false);
  });

  test("eq", () => {
    expect(injectCurrent(eq(equal))).toBe(true);
    expect(injectCurrent(eq(greater))).toBe(false);
    expect(injectCurrent(eq(less))).toBe(false);
  });

  test("ne", () => {
    expect(injectCurrent(ne(equal))).toBe(false);
    expect(injectCurrent(ne(greater))).toBe(true);
    expect(injectCurrent(ne(less))).toBe(true);
  });

  test("ge", () => {
    expect(injectCurrent(ge(equal))).toBe(true);
    expect(injectCurrent(ge(greater))).toBe(false);
    expect(injectCurrent(ge(less))).toBe(true);
  });

  test("gt", () => {
    expect(injectCurrent(gt(equal))).toBe(false);
    expect(injectCurrent(gt(greater))).toBe(false);
    expect(injectCurrent(gt(less))).toBe(true);
  });
});

describe("weekday constraints", () => {
  const daysOfTheWeek = [1, 2, 3, 4, 5, 6, 7];

  const ds = map(
    (x: number) =>
      moment("2020-10-12 17:23:57")
        .clone()
        .add(x - 1, "days"),
    daysOfTheWeek,
  );

  test("onMonday", () => {
    ds.forEach((d) => expect(onMonday(d)).toBe(d.isoWeekday() === 1));
  });

  test("onTuesday", () => {
    ds.forEach((d) => expect(onTuesday(d)).toBe(d.isoWeekday() === 2));
  });

  test("onWednesday", () => {
    ds.forEach((d) => expect(onWednesday(d)).toBe(d.isoWeekday() === 3));
  });

  test("onThursday", () => {
    ds.forEach((d) => expect(onThursday(d)).toBe(d.isoWeekday() === 4));
  });

  test("onFriday", () => {
    ds.forEach((d) => expect(onFriday(d)).toBe(d.isoWeekday() === 5));
  });

  test("onSathurday", () => {
    ds.forEach((d) => expect(onSathurday(d)).toBe(d.isoWeekday() === 6));
  });

  test("onSunday", () => {
    ds.forEach((d) => expect(onSunday(d)).toBe(d.isoWeekday() === 7));
  });
});
