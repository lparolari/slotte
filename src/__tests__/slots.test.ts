import moment from "moment";

import { slot } from "../slot";

const d1 = moment();
const start = d1;

describe("single time slot", () => {
  it("create a time slot", () => {
    expect(slot([])(start)).not.toEqual([]);
  });

  it("create first value equal to start", () => {
    expect(slot([])(start)).toEqual([start]);
  });

  it("create value when all constraints are true", () => {
    const t = () => true;
    const f = () => false;

    expect(slot([])(start)).not.toEqual([]);
    expect(slot([t])(start)).not.toEqual([]);
    expect(slot([t, t, t])(start)).not.toEqual([]);
    expect(slot([t, f])(start)).toEqual([]);
    expect(slot([f, t])(start)).toEqual([]);
    expect(slot([f, f, f])(start)).toEqual([]);
    expect(slot([f])(start)).toEqual([]);
  });
});
