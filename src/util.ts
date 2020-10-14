import * as R from "ramda";
import { Moment } from "moment";

import { Slot } from "./slot";

const repeat = (n: number) => R.repeat(0, n);

export const take = (n: number) => (iterable: IterableIterator<Slot>): Slot[] =>
  R.map(() => iterable.next().value, repeat(n));

export const flatten = R.flatten;

// takeUntil `m`, with `m` excluded (stops before)
export const takeUntil = (m: Moment) => (iterable: Iterable<Slot>): Slot[] => {
  const times: Slot[] = [];

  for (const tss of iterable) {
    if (tss.length > 0) {
      const [ts] = tss;
      if (ts.isSameOrAfter(m)) return times;
      times.push([ts]);
    }
  }

  return times;
};
