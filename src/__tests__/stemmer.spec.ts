import { stem } from "../stemmer";
import { getVocab } from "./fixtures/vocab";

describe("stem()", () => {
  it("stems the word according to vocab", () => {
    const stemmingVocabs = getVocab();
    for (const stemVocab of stemmingVocabs) {
      expect(stem(stemVocab.input)).toEqual(stemVocab.output);
    }
  });
});
