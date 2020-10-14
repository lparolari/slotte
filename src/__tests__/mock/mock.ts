import moment, { Moment } from "moment";

export const revive = (s: string): Moment => moment(s, "YYYY-MM-DD HH:mm:ss");

export const mock = {
  workingWeek: [
    "2020-10-12 08:00:00",
    "2020-10-12 09:00:00",
    "2020-10-12 10:00:00",
    "2020-10-12 11:00:00",
    "2020-10-12 14:00:00",
    "2020-10-12 15:00:00",
    "2020-10-12 16:00:00",
    "2020-10-12 17:00:00",
    "2020-10-13 08:00:00",
    "2020-10-13 09:00:00",
    "2020-10-13 10:00:00",
    "2020-10-13 11:00:00",
    "2020-10-13 14:00:00",
    "2020-10-13 15:00:00",
    "2020-10-13 16:00:00",
    "2020-10-13 17:00:00",
    "2020-10-14 08:00:00",
    "2020-10-14 09:00:00",
    "2020-10-14 10:00:00",
    "2020-10-14 11:00:00",
    "2020-10-14 14:00:00",
    "2020-10-14 15:00:00",
    "2020-10-14 16:00:00",
    "2020-10-14 17:00:00",
    "2020-10-15 08:00:00",
    "2020-10-15 09:00:00",
    "2020-10-15 10:00:00",
    "2020-10-15 11:00:00",
    "2020-10-15 14:00:00",
    "2020-10-15 15:00:00",
    "2020-10-15 16:00:00",
    "2020-10-15 17:00:00",
    "2020-10-16 08:00:00",
    "2020-10-16 09:00:00",
    "2020-10-16 10:00:00",
    "2020-10-16 11:00:00",
    "2020-10-16 14:00:00",
    "2020-10-16 15:00:00",
    "2020-10-16 16:00:00",
    "2020-10-16 17:00:00",
  ],
};