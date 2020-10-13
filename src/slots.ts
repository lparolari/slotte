import moment, { Moment } from "moment";
import { Constraint, validate } from "./constraint";

export type Interval = {
  amount: moment.DurationInputArg1;
  unit: moment.DurationInputArg2;
};

export type Slot = string;

export const addInterval = (interval: Interval) => (m: Moment): Moment => m.clone().add(interval.amount, interval.unit);

export const slots = (interval: Interval) => (constraints: Constraint[]) => (start: Moment) => {
  return (function* () {
    let newStart = start;

    while (true) {
      yield one(constraints)(newStart);
      newStart = addInterval(interval)(newStart);
    }
  })();
};

export const one = (constraints: Constraint[]) => (start: Moment): string[] => {
  const current = moment(start, "HH:mm");

  if (validate(constraints)(current)) {
    return [current.format("HH:mm")];
  }

  return [];
};
