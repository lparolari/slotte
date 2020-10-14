import { slots } from "../index";

describe("index", () => {
  it("expose functions as interface to package", () => {
    expect(slots).toBeDefined();
  });
});
