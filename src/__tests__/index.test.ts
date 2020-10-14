import { slot, generator } from "../index";

describe("index", () => {
  it("expose functions as interface to package", () => {
    expect(slot).toBeDefined();
    expect(generator).toBeDefined();
  });
});
