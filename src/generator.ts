import { Slot } from "./slots";

import * as R from "ramda";

const repeat = (n: number) => R.repeat(0, n);

export const take = (n: number) => (iterable: IterableIterator<Slot[]>): string[][] =>
  R.map(() => iterable.next().value as string[], repeat(n));

export const flatten = R.flatten;
