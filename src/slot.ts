import { Moment } from "moment";

import { Constraint, validate } from "./constraint";

export type Slot = Moment[];

export const slot = (constraints: Constraint[]) => (start: Moment): Slot => {
  const current = start;

  if (!validate(constraints)(current)) {
    return [];
  }

  return [current];
};
