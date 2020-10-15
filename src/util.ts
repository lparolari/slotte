import moment, { Moment } from "moment";
import * as R from "ramda";

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
