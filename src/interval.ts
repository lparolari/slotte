import moment, { Moment } from "moment";

export type Interval = {
  amount: moment.DurationInputArg1;
  unit: moment.DurationInputArg2;
};

export const addInterval = (interval: Interval) => (m: Moment): Moment => m.clone().add(interval.amount, interval.unit);
