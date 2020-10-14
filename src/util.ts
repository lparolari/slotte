import { Moment } from "moment";
import { Interval } from "./slots";

export const addInterval = (interval: Interval) => (m: Moment): Moment => m.clone().add(interval.amount, interval.unit);
