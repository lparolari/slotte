import moment from "moment";

import { Interval, Slot, slots } from "../slots";
import { take, flatten } from "../generator";

describe("generator", () => {
  const interval: Interval = { amount: 30, unit: "minutes" };
  const d1 = moment();
  const start = d1;

  let gen: Generator<Slot, never, unknown>;

  beforeEach(() => {
    gen = slots(interval)([])(start);
  });

  describe("take", () => {
    it("get n element from generator", () => {
      expect(take(0)(gen)).toHaveLength(0);
      expect(take(5)(gen)).toHaveLength(5);
    });
  });

  describe("flatten", () => {
    it("flatten elements from generator", () => {
      expect(flatten(take(0)(gen))).toHaveLength(0);
      expect(flatten(take(5)(gen))).toHaveLength(5);
    });
  });
});
