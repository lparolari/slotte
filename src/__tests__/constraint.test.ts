import moment, { Moment } from "moment";

import { eq, ge, gt, le, lt, ne } from "../constraint";
import { addInterval } from "../util";

describe("comparison constraints", () => {
  const c = moment();
  const equal = c;
  const greater = addInterval({ amount: 1, unit: "hour" })(c);
  const less = addInterval({ amount: -1, unit: "hour" })(c);

  const injectCurrent = (f: (c: Moment) => boolean): boolean => f(c);

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
