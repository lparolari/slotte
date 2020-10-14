import { Moment } from "moment";
import { Constraint } from "./constraint";
import { addInterval, Interval } from "./interval";
import { slot, Slot } from "./slot";

export const generator = (interval: Interval) => (constraints: Constraint[]) => (
  start: Moment,
): Generator<Slot, never, unknown> => {
  return (function* () {
    let newStart = start;

    while (true) {
      yield slot(constraints)(newStart);
      newStart = addInterval(interval)(newStart);
    }
  })();
};
