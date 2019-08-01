import { toString } from "../utils";

describe(".toString()", () => {
  it("calls toString() on the object", () => {
    expect(toString(1)).toEqual("1");
  });

  it("returns an empty string for undefined values", () => {
    expect(toString(undefined)).toEqual("");
  });
});
