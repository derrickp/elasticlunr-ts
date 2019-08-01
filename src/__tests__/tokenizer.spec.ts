import {
  defaultSeperator,
  getSeparator,
  resetSeparator,
  setSeparator,
  tokenize
} from "../tokenizer";

describe("tokenize()", () => {
  afterEach(() => resetSeparator());

  it("splits simple strings into tokens", () => {
    const simpleString = "this is a simple string";
    const tokens = tokenize(simpleString);

    expect(tokens).toStrictEqual(["this", "is", "a", "simple", "string"]);
  });

  it("downcases tokens", () => {
    const simpleString = "FOO BAR";
    const tags = ["Foo", "BAR"];

    const expected = ["foo", "bar"];
    expect(tokenize(simpleString)).toStrictEqual(expected);
    expect(tokenize(tags)).toStrictEqual(expected);
  });

  it("handles arrays of strings", () => {
    const tags = ["foo", "bar"];
    const tokens = tokenize(tags);

    expect(tokens).toStrictEqual(tags);
  });

  it("removes undefined or null values from input array", () => {
    const arr = ["foo", undefined, null, "bar"];
    const tokens = tokenize(arr as any);

    expect(tokens).toStrictEqual(["foo", "bar"]);
  });

  it("handles multiple white spaces", () => {
    const testString = "  foo    bar  ";
    const tokens = tokenize(testString);

    expect(tokens).toStrictEqual(["foo", "bar"]);
  });

  it("handles null-like arguments", () => {
    expect(tokenize(null)).toStrictEqual([]);
    expect(tokenize(undefined)).toStrictEqual([]);
  });

  it("coerces values to string", () => {
    const date = new Date(Date.UTC(2013, 0, 1, 12));
    const obj = {
      toString: () => {
        return "custom object";
      }
    };

    expect(tokenize(41)).toStrictEqual(["41"]);
    expect(tokenize(false)).toStrictEqual(["false"]);
    expect(tokenize(obj)).toStrictEqual(["custom", "object"]);

    // slicing here to avoid asserting on the timezone part of the date
    // that will be different whereever the test is run.
    expect(tokenize(date).slice(0, 4)).toStrictEqual([
      "tue",
      "jan",
      "01",
      "2013"
    ]);
  });

  it("splits strings with hyphens", () => {
    const simpleString = "take the New York-San Francisco flight";
    const tokens = tokenize(simpleString);

    expect(tokens).toStrictEqual([
      "take",
      "the",
      "new",
      "york",
      "san",
      "francisco",
      "flight"
    ]);
  });

  it("splits strings with hyphens and spaces", () => {
    const simpleString = "Solve for A - B";
    const tokens = tokenize(simpleString);

    expect(tokens).toStrictEqual(["solve", "for", "a", "b"]);
  });

  describe("tokenizing arrays", () => {
    it("tokenizes the array", () => {
      const str = ["hello world", "glad to see you"];
      const tokens = tokenize(str);
      expect(tokens).toStrictEqual([
        "hello",
        "world",
        "glad",
        "to",
        "see",
        "you"
      ]);
    });

    it("tokenizes a different array", () => {
      const str = ["helloworld", "glad to see you"];
      const tokens = tokenize(str);
      expect(tokens).toStrictEqual(["helloworld", "glad", "to", "see", "you"]);
    });

    it("removes null and undefined values", () => {
      const str = ["helloworld", null, undefined, "glad to see you"];
      const tokens = tokenize(str);
      expect(tokens).toStrictEqual(["helloworld", "glad", "to", "see", "you"]);
    });

    it("tokenizes array with hyphens", () => {
      const str = ["helloworld", "glad to see you", "hyper-parameters"];
      const tokens = tokenize(str);
      expect(tokens).toStrictEqual([
        "helloworld",
        "glad",
        "to",
        "see",
        "you",
        "hyper",
        "parameters"
      ]);
    });
  });
});

describe("setSeparator()", () => {
  it("uses the custom separator", () => {
    const sep = /[\/]+/;
    const s = "hello/world/I/love";

    const sep2 = /[\\]+/;
    const s2 = "hello\\world\\I\\love";

    const sep3 = /[\/\%]+/;
    const s3 = "hello/world/%%%apple%pie";

    setSeparator(sep);
    expect(tokenize(s)).toStrictEqual(["hello", "world", "i", "love"]);

    setSeparator(sep2);
    expect(tokenize(s2)).toStrictEqual(["hello", "world", "i", "love"]);

    setSeparator(sep3);
    expect(tokenize(s3)).toStrictEqual(["hello", "world", "apple", "pie"]);
  });
});

describe("resetSeparator()", () => {
  it("properly resets the separator", () => {
    const sep = /[\/]+/;
    const s = "hello world I love apple";

    setSeparator(sep);
    resetSeparator();
    expect(tokenize(s)).toStrictEqual(["hello", "world", "i", "love", "apple"]);
  });
});

describe("getSeparator()", () => {
  it("gets the current separator", () => {
    const sep = /[\/]+/;
    setSeparator(sep);
    expect(getSeparator()).toStrictEqual(sep);

    resetSeparator();
    expect(getSeparator()).toStrictEqual(defaultSeperator);
  });
});
