import * as A from "fp-ts/lib/Array";
import { flow } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { Ord } from "fp-ts/lib/Ord";
import moment, { Moment } from "moment";
import * as R from "ramda";

import { Info, Slot } from "./slot";

const repeat = (n: number) => R.repeat(0, n);

export const take = (n: number) => (
  iterable: Generator<Slot, Slot, Slot>,
): Slot[] => R.map(() => iterable.next().value, repeat(n));

export const flatten: (ss: Slot[]) => Info[] = flow(
  A.map(
    O.fold(
      () => [],
      (x: Info) => [x],
    ),
  ),
  A.flatten,
);

/**
 * Take slots until `pred` is true.
 *
 * @param pred A predicate that returns true whether the search has to continue or not, according to given date.
 * @param generator A generator for slots.
 * @param acc A result accumulator for recursive calls.
 * @returns Slots taken from generator in reverse order.
 */
const takeUntilAcc = (pred: (m: Moment) => boolean) => (
  generator: Generator<Slot, Slot, Slot>,
) => (acc: Slot[]): Slot[] => {
  const hasToContinueSearch = O.fold(
    // We ignore next lint from code coverage because it will never be reached:
    // the case of not having a value is covered in `if (hasValue ...)`.
    /* istanbul ignore next */
    () => false,
    (ts: Moment) => pred(ts),
  );
  const hasValue = O.isSome;

  const next = generator.next();
  const isIteratorAtTheEnd = next.done;
  const optionalSlot = next.value;

  if (isIteratorAtTheEnd) {
    // We have finished the sequence
    return acc;
  }

  if (!hasValue(optionalSlot)) {
    // We continue searching
    return takeUntilAcc(pred)(generator)(acc);
  }

  if (!hasToContinueSearch(optionalSlot)) {
    // We return values calculated until now
    return acc;
  }

  // We add this slot and continue searching
  return takeUntilAcc(pred)(generator)([optionalSlot, ...acc]);
};

/** Take slots until `pred` is true. */
export const takeUntilPred = (pred: (m: Moment) => boolean) => (
  generator: Generator<Slot, Slot, Slot>,
): Slot[] => takeUntilAcc(pred)(generator)([]);

/** Take slots until reached `stop` date. */
export const takeUntil = (stop: Moment) => (
  generator: Generator<Slot, Slot, Slot>,
): Slot[] => takeUntilPred((m: Moment) => m.isBefore(stop))(generator);

type Format = { date: string; datetime: string };

/**
 * Change the time of `current` to `time`. Date and datetime parsing is done via formats in `format`.
 * @param format Date and datetime format to use for parsing.
 * @param time The time to change to.
 * @param current The datetime to modify.
 * @returns A new moment where date is `current` and time is `time`.
 */
const changeTimeWithFormat = (format: Format) => (time: string) => (
  current: Moment,
): Moment => moment(`${current.format(format.date)} ${time}`, format.datetime);

/**
 * Change `current` time to `time`.
 * Uses simple format
 * * date: `YYYY-MM-DD`,
 * * datetime: `YYYY-MM-DD HH:mm:ss`,
 * @returns A new moment where date is `current` and time is `time`.
 */
export const changeTime = changeTimeWithFormat({
  date: "YYYY-MM-DD",
  datetime: "YYYY-MM-DD HH:mm:ss",
});

/* istanbul ignore next */
export const ordMoment: Ord<Moment> = {
  equals: (x: Moment, y: Moment) => x.isSame(y),
  compare: (x: Moment, y: Moment) =>
    x.isBefore(y) ? -1 : x.isAfter(y) ? 1 : 0,
};
