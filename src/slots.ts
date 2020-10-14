import moment, { Moment } from "moment";

import { Constraint, validate } from "./constraint";
import { addInterval } from "./util";

export type Interval = {
  amount: moment.DurationInputArg1;
  unit: moment.DurationInputArg2;
};

export type Slot = string[];

export const generator = (interval: Interval) => (constraints: Constraint[]) => (
  start: Moment,
): Generator<Slot, never, unknown> => {
  return (function* () {
    let newStart = start;

    while (true) {
      yield one(constraints)(newStart);
      newStart = addInterval(interval)(newStart);
    }
  })();
};

export const slots = generator;

export const one = (constraints: Constraint[]) => (start: Moment): Slot => {
  const current = moment(start, "HH:mm");

  if (!validate(constraints)(current)) {
    return [];
  }

  return [current.format("HH:mm")];
};
