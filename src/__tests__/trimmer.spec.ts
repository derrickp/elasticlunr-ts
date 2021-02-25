import { trim } from "../trimmer";

describe("trim()", () => {
  it("does nothing with basic latin characters", () => {
    const token = "hello";
    expect(trim(token)).toEqual(token);
  });

  it("removing leading and trailing punctuation", () => {
    const fullStop = "hello.",
      innerApostrophe = "it's",
      trailingApostrophe = "james'",
      exclamationMark = "stop!",
      comma = "first,",
      empty = "",
      brackets = "[tag]",
      moreBrackets = "[[[tag]]]",
      combined1 = "[[!@#@!hello]]]}}}",
      combined2 = "~!@@@hello***()()()]]";

    expect(trim(fullStop)).toStrictEqual("hello");
    expect(trim(innerApostrophe)).toStrictEqual("it's");
    expect(trim(trailingApostrophe)).toStrictEqual("james");
    expect(trim(exclamationMark)).toStrictEqual("stop");
    expect(trim(comma)).toStrictEqual("first");
    expect(trim(empty)).toStrictEqual("");
    expect(trim(brackets)).toEqual("tag");
    expect(trim(moreBrackets)).toStrictEqual("tag");
    expect(trim(combined1)).toStrictEqual("hello");
    expect(trim(combined2)).toStrictEqual("hello");
  });

  describe("null input to the trimmer", () => {
    it("throws an Error", () => {
      let token: any = undefined;
      expect(() => trim(token)).toThrowError("token should not be undefined");

      token = null;
      expect(() => trim(token)).toThrowError("token should not be undefined");

      token = void 0;
      expect(() => trim(token)).toThrowError("token should not be undefined");
    });
  });
});
