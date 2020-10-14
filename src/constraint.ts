import { Moment } from "moment";
import * as R from "ramda";

export type Constraint = (current: Moment) => boolean;

export const validate = (constraints: Constraint[]) => (current: Moment) =>
  R.all(R.identity, R.map(R.applyTo(current), constraints));

export const gt = (threshold: Moment) => (current: Moment): boolean => current.isAfter(threshold); // c > t
export const ge = (threshold: Moment) => (current: Moment): boolean => current.isSameOrAfter(threshold); // c >= t
export const eq = (threshold: Moment) => (current: Moment): boolean => current.isSame(threshold); // c == t
export const ne = (threshold: Moment) => (current: Moment): boolean => !current.isSame(threshold); // c != t
export const le = (threshold: Moment) => (current: Moment): boolean => current.isSameOrBefore(threshold); // c <= t
export const lt = (threshold: Moment) => (current: Moment): boolean => current.isBefore(threshold); // c < t
