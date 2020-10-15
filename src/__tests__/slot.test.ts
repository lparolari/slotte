import { none, some } from "fp-ts/lib/Option";
import moment from "moment";

import { slot } from "../slot";

const d1 = moment();
const start = d1;

describe("single time slot", () => {
  it("create a time slot", () => {
    expect(slot([])(start)).not.toEqual(none);
  });

  it("create first value equal to start", () => {
    expect(slot([])(start)).toEqual(some(start));
  });

  it("work also with constraints", () => {
    expect(slot([() => true])(start)).toEqual(some(start));
    expect(slot([() => false])(start)).toEqual(none);
  });
});
