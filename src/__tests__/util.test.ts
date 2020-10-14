import moment from "moment";

import { generator } from "../generator";
import { addInterval, Interval } from "../interval";
import { Slot } from "../slot";
import { flatten, take, takeUntil } from "../util";

describe("generator", () => {
  const interval: Interval = { amount: 30, unit: "minutes" };
  const d1 = moment();
  const start = d1;

  let gen: Generator<Slot, never, unknown>;

  beforeEach(() => {
    gen = generator(interval)([])(start);
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

  describe("takeUntil", () => {
    const stop = addInterval({ amount: 1, unit: "hour" })(start);

    it("take elements until date", () => {
      expect(flatten(takeUntil(stop)(gen))).toHaveLength(2);
    });

    it("take nothing if iterable is at the end", () => {
      const gen: Generator<Slot, Slot, unknown> = (function* () {
        yield [];
        return [];
      })();
      expect(takeUntil(stop)(gen)).toHaveLength(0);
    });
  });
});
