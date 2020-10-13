import { Moment } from "moment";
import * as R from "ramda";

export type Constraint = (current: Moment) => boolean;

export const validate = (constraints: Constraint[]) => (current: Moment) =>
  R.all(R.identity, R.map(R.applyTo(current), constraints));
