import { none, Option, some } from "fp-ts/lib/Option";
import { Moment } from "moment";

import { Constraint, validate } from "./constraint";

export type Info = Moment;
export type Slot = Option<Info>;

export const slot = (constraints: Constraint[]) => (start: Moment): Slot => {
  const current = start;

  if (!validate(constraints)(current)) {
    return none;
  }

  return some(current);
};
