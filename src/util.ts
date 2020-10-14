import * as R from "ramda";

import { Slot } from "./slot";

const repeat = (n: number) => R.repeat(0, n);

export const take = (n: number) => (iterable: IterableIterator<Slot>): Slot[] =>
  R.map(() => iterable.next().value, repeat(n));

export const flatten = R.flatten;
