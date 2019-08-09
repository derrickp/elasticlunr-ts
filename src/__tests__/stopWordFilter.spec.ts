import {
  addStopWords,
  clearStopWords,
  getStopWords,
  resetStopWords,
  stopWordFilter,
  defaultStopWords
} from "../stopWordFilter";

describe("stopWordFilter()", () => {
  afterEach(() => resetStopWords());

  it("stops stop words", () => {
    const stopWords = ["the", "and", "but", "than", "when"];

    for (const word of stopWords) {
      expect(stopWordFilter(word)).toBeUndefined();
    }
  });

  it("lets non stop words pass through", () => {
    const nonStopWords = ["interesting", "words", "pass", "through"];

    for (const word of nonStopWords) {
      expect(stopWordFilter(word)).toStrictEqual(word);
    }
  });

  it("should not filter Object.prototype terms", () => {
    var nonStopWords = ["constructor", "hasOwnProperty", "toString", "valueOf"];

    for (const word of nonStopWords) {
      expect(stopWordFilter(word)).toStrictEqual(word);
    }
  });

  describe("defaultStopWords", () => {
    it("matches the result of getStopWords()", () => {
      expect(getStopWords()).toStrictEqual(defaultStopWords);
    });
  });

  describe("clearStopWords()", () => {
    it("clears stop words by", () => {
      clearStopWords();
      expect(getStopWords()).toStrictEqual({});
    });
  });

  describe("addStopWords()", () => {
    it("adds customized stop words", () => {
      const stopWords = ["the", "and", "but", "than", "when"];

      const expected: { [key: string]: boolean } = {};
      for (const word of stopWords) {
        expected[word] = true;
      }

      clearStopWords();
      addStopWords(stopWords);
      expect(getStopWords()).toStrictEqual(expected);
    });

    it("stops with customized stopwords", () => {
      const stopWords = ["hello", "world", "microsoft", "TTS"];

      addStopWords(stopWords);
      for (const word of stopWords) {
        expect(stopWordFilter(word)).toBeUndefined();
      }
    });

    it("lets non stopwords pass through", () => {
      const stopWords = ["hello", "world", "microsoft", "TTS"];
      const nonStopWords = ["interesting", "words", "pass", "through"];

      addStopWords(stopWords);

      for (const word of nonStopWords) {
        expect(stopWordFilter(word)).toStrictEqual(word);
      }
    });
  });

  it("returns undefined for undefined-like inputs", () => {
    expect(stopWordFilter(undefined as any)).toBeUndefined();
    expect(stopWordFilter(null as any)).toBeUndefined();
  });
});
