import { Moment, unitOfTime } from "moment";
import * as R from "ramda";

export type Constraint = (current: Moment) => boolean;

export const validate = (constraints: Constraint[]) => (
  current: Moment,
): boolean => R.all(R.identity, R.map(R.applyTo(current), constraints));

// comparison constraints
export const gt = (threshold: Moment) => (current: Moment): boolean =>
  current.isAfter(threshold); // c > t

export const ge = (threshold: Moment) => (current: Moment): boolean =>
  current.isSameOrAfter(threshold); // c >= t

export const eq = (threshold: Moment) => (current: Moment): boolean =>
  current.isSame(threshold); // c == t

export const ne = (threshold: Moment) => (current: Moment): boolean =>
  !current.isSame(threshold); // c != t

export const le = (threshold: Moment) => (current: Moment): boolean =>
  current.isSameOrBefore(threshold); // c <= t

export const lt = (threshold: Moment) => (current: Moment): boolean =>
  current.isBefore(threshold); // c < t

// set constraints
export const betweenWithInclusivityAndGranularity = (
  granularity: unitOfTime.StartOf,
) => (inclusivity: "()" | "[)" | "(]" | "[]") => (d1: Moment, d2: Moment) => (
  current: Moment,
): boolean => current.isBetween(d1, d2, granularity, inclusivity);

export const betweenWithInclusivity = betweenWithInclusivityAndGranularity(
  "minute",
);

export const between = betweenWithInclusivity("[)");

// weekday constraints
export const onMonday = (m: Moment): boolean => m.isoWeekday() === 1;
export const onTuesday = (m: Moment): boolean => m.isoWeekday() === 2;
export const onWednesday = (m: Moment): boolean => m.isoWeekday() === 3;
export const onThursday = (m: Moment): boolean => m.isoWeekday() === 4;
export const onFriday = (m: Moment): boolean => m.isoWeekday() === 5;
export const onSathurday = (m: Moment): boolean => m.isoWeekday() === 6;
export const onSunday = (m: Moment): boolean => m.isoWeekday() === 7;
