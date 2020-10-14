import moment, { Moment } from "moment";

import { eq, ge, gt, le, lt, ne, validate } from "../constraint";
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
