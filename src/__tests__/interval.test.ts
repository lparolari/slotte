import moment from "moment";

import { addInterval, Interval } from "../interval";

describe("addInterval", () => {
  const interval: Interval = { amount: 30, unit: "minutes" };
  const d1 = moment();
  const d2 = addInterval(interval)(d1);
  const d3 = d1.clone().add(interval.amount, interval.unit);

  it("add interval like moment", () => {
    expect(d2).toEqual(d3);
  });

  it("do not perform side effect on invocation object", () => {
    expect(d2).not.toEqual(d1);
  });
});
