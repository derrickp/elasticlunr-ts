import { stemmingFixture } from "./fixtures/stemmingVocab";
import { porterStem } from "../stemmer";

describe("porterStem()", () => {
  it("should stem the example words correctly", () => {
    Object.keys(stemmingFixture).forEach(word => {
      const expected = stemmingFixture[word];

      expect(porterStem(word)).toStrictEqual(expected);
    });
  });
});
