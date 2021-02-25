import { InvertedIndex, TokenInfo, SerializedData } from "../InvertedIndex";

function buildTokenInfo(ref: string, tf: number): TokenInfo {
  return { ref, tf };
}

describe("InvertedIndex", () => {
  it("constructs empty index", () => {
    const index = new InvertedIndex();
    expect(index.root).toEqual({ docs: {}, df: 0 });
    expect(index.root.df).toEqual(0);
  });

  describe("addToken()", () => {
    it("can index basic token", () => {
      const index = new InvertedIndex();
      const tokenInfo = buildTokenInfo("123", 1);
      const token = "foo";

      index.addToken(token, tokenInfo);
      expect(index.root["f"]["o"]["o"]["docs"]["123"]).toEqual({ tf: 1 });
      expect(index.getDocFrequency("foo")).toEqual(1);
      expect(index.getTermFrequency("foo", "123")).toEqual(1);
    });

    it("can add another document to the token successfully", () => {
      const index = new InvertedIndex();
      const tokenInfo1 = buildTokenInfo("123", 1);
      const tokenInfo2 = buildTokenInfo("456", 1);
      const token = "foo";

      index.addToken(token, tokenInfo1);
      index.addToken(token, tokenInfo2);

      expect(index.root["f"]["o"]["o"]["docs"]["123"]).toEqual({ tf: 1 });
      expect(index.root["f"]["o"]["o"]["docs"]["456"]).toEqual({ tf: 1 });
    });

    it("can add to an existing token", () => {
      const index = new InvertedIndex();
      const tokenInfo1 = buildTokenInfo("123", 1);
      const tokenInfo2 = buildTokenInfo("456", 1);
      const tokenInfoReplacement = buildTokenInfo("456", 100);
      const token = "foo";

      index.addToken(token, tokenInfo1);
      index.addToken(token, tokenInfo2);
      index.addToken(token, tokenInfoReplacement);

      expect(index.root["f"]["o"]["o"]["docs"][456]).toEqual({ tf: 100 });
    });
  });

  describe("hasToken()", () => {
    it("returns false when given an invalid token", () => {
      const index = new InvertedIndex();
      expect(index.hasToken("")).toEqual(false);
    });

    it("can check a token successfully", () => {
      const index = new InvertedIndex();
      const tokenInfo1 = buildTokenInfo("123", 1);
      const token = "foo";

      index.addToken(token, tokenInfo1);

      expect(index.hasToken(token)).toEqual(true);
    });

    it("returns false for token that does not exist", () => {
      const index = new InvertedIndex();
      const tokenInfo = buildTokenInfo("123", 1);
      const token = "foo";

      index.addToken(token, tokenInfo);

      expect(index.hasToken("fooo")).toEqual(false);
      expect(index.hasToken("bar")).toEqual(false);
      expect(index.hasToken("fof")).toEqual(false);
    });

    it("returns correctly for tokens it has", () => {
      const index = new InvertedIndex();
      const tokenInfo = buildTokenInfo("123", 1);
      const token = "foo";

      index.addToken(token, tokenInfo);
      expect(index.hasToken(token)).toEqual(true);
      expect(index.hasToken("fo")).toEqual(true);
      expect(index.hasToken("f")).toEqual(true);

      expect(index.hasToken("bar")).toEqual(false);
      expect(index.hasToken("foo ")).toEqual(false);
      expect(index.hasToken("foo  ")).toEqual(false);
    });
  });

  describe("getTermFrequency()", () => {
    it("returns 0 for token that gives no node", () => {
      const index = new InvertedIndex();

      expect(index.getTermFrequency("foo", "123")).toEqual(0);
    });

    it("returns 0 when it cannot find docRef", () => {
      const index = new InvertedIndex();
      const tokenInfo = buildTokenInfo("123", 1);
      const token = "foo";

      index.addToken(token, tokenInfo);

      expect(index.getTermFrequency("foo", "456")).toEqual(0);
    });

    it("returns right for single doc", () => {
      const index = new InvertedIndex();
      const tokenInfo = buildTokenInfo("123", 1);
      const token = "foo";

      index.addToken(token, tokenInfo);

      expect(index.getTermFrequency("foo", "123")).toEqual(1);
    });

    it("gets the term frequency with multiple documents", () => {
      const index = new InvertedIndex();
      const tokenInfo1 = buildTokenInfo("123", 1);
      const tokenInfo2 = buildTokenInfo("456", 1);
      const token = "foo";

      index.addToken(token, tokenInfo1);
      index.addToken(token, tokenInfo2);

      expect(index.getTermFrequency("foo", "123")).toEqual(1);
      expect(index.getTermFrequency("foo", "456")).toEqual(1);
    });

    it("gets correctly from a token that was added to", () => {
      const index = new InvertedIndex();
      const tokenInfo1 = buildTokenInfo("123", 1);
      const tokenInfo2 = buildTokenInfo("456", 1);
      const tokenInfoReplacement = buildTokenInfo("456", 100);
      const token = "foo";

      index.addToken(token, tokenInfo1);
      index.addToken(token, tokenInfo2);
      index.addToken(token, tokenInfoReplacement);

      expect(index.getTermFrequency("foo", "456")).toEqual(100);
    });
  });

  describe("getDocFrequency()", () => {
    it("can index basic token", () => {
      const index = new InvertedIndex();
      const tokenInfo = buildTokenInfo("123", 1);
      const token = "foo";

      index.addToken(token, tokenInfo);

      expect(index.getDocFrequency("foo")).toEqual(1);
    });

    it("gets the frequency with multiple documents", () => {
      const index = new InvertedIndex();
      const tokenInfo1 = buildTokenInfo("123", 1);
      const tokenInfo2 = buildTokenInfo("456", 1);
      const token = "foo";

      index.addToken(token, tokenInfo1);
      index.addToken(token, tokenInfo2);

      expect(index.getDocFrequency("foo")).toEqual(2);
    });

    it("returns 0 for non-existent token", () => {
      const index = new InvertedIndex();
      const tokenInfo1 = buildTokenInfo("123", 1);
      const tokenInfo2 = buildTokenInfo("456", 1);
      const token = "foo";

      index.addToken(token, tokenInfo1);
      index.addToken(token, tokenInfo2);

      expect(index.getDocFrequency(token)).toEqual(2);
      expect(index.getDocFrequency("fox")).toEqual(0);
    });

    it("gets correctly from a token that was added to", () => {
      const index = new InvertedIndex();
      const tokenInfo1 = buildTokenInfo("123", 1);
      const tokenInfo2 = buildTokenInfo("456", 1);
      const tokenInfoReplacement = buildTokenInfo("456", 100);
      const token = "foo";

      index.addToken(token, tokenInfo1);
      index.addToken(token, tokenInfo2);
      index.addToken(token, tokenInfoReplacement);

      expect(index.getDocFrequency(token)).toEqual(2);
    });
  });

  describe("getDocs()", () => {
    it("returns empty for doc that does not exist", () => {
      const index = new InvertedIndex();
      expect(index.getDocs("foo")).toEqual({});
    });

    it("returns empty when giving an empty token", () => {
      const index = new InvertedIndex();
      const tokenInfo = buildTokenInfo("123", 1);
      const token = "foo";

      index.addToken(token, tokenInfo);
      expect(index.getDocs("")).toEqual({});
    });

    it("returns the doc for a token that has been added", () => {
      const index = new InvertedIndex();
      const tokenInfo = buildTokenInfo("123", 1);
      const token = "foo";

      index.addToken(token, tokenInfo);
      expect(index.getDocs("foo")).toEqual({ "123": { tf: 1 } });
    });

    it("does not return docs for other tokens", () => {
      const index = new InvertedIndex();
      const tokenInfo = buildTokenInfo("123", 1);
      const token = "foo";

      index.addToken(token, tokenInfo);
      index.addToken("boo", buildTokenInfo("234", 100));
      index.addToken("too", buildTokenInfo("345", 101));

      expect(index.getDocs("foo")).toEqual({ "123": { tf: 1 } });
    });

    it("returns all docs for token", () => {
      const index = new InvertedIndex();
      const tokenInfo = buildTokenInfo("123", 1);
      const token = "foo";

      index.addToken(token, tokenInfo);
      index.addToken(token, buildTokenInfo("234", 100));
      index.addToken(token, buildTokenInfo("345", 101));

      expect(index.getDocs("foo")).toEqual({
        "123": { tf: 1 },
        "234": { tf: 100 },
        "345": { tf: 101 },
      });
    });
  });

  describe("removeToken()", () => {
    it("removes the token successfully", () => {
      const index = new InvertedIndex();
      const tokenInfo = buildTokenInfo("123", 1);
      const token = "foo";

      index.addToken(token, tokenInfo);
      index.removeToken(token, tokenInfo.ref);

      expect(index.getDocs(token)).toEqual({});
      expect(index.getDocFrequency(token)).toEqual(0);
      expect(index.hasToken(token)).toEqual(true);
    });

    it("removes a non-existant document but does not touch others", () => {
      const index = new InvertedIndex();
      const tokenInfo1 = buildTokenInfo("123", 1);
      const tokenInfo2 = buildTokenInfo("567", 1);
      const token = "foo";

      index.addToken(token, tokenInfo1);
      index.addToken("bar", tokenInfo2);
      index.removeToken(token, "456");

      expect(index.getDocs(token)).toEqual({ 123: { tf: 1 } });
      expect(index.getDocFrequency("foo")).toEqual(1);
    });

    it("removes a document from a key that does not exist without exploding", () => {
      const index = new InvertedIndex();

      index.removeToken("foo", "123");
      expect(index.hasToken("foo")).toEqual(false);
      expect(index.getDocFrequency("foo")).toEqual(0);
    });

    it("does not explode with invalid token", () => {
      const index = new InvertedIndex();
      index.removeToken("", "123");
    });
  });

  describe("expandToken()", () => {
    it("returns an empty array when given no token", () => {
      const index = new InvertedIndex();
      expect(index.expandToken("")).toEqual([]);
    });

    it("expands all descendant tokens", () => {
      const index = new InvertedIndex();
      const tokenInfo = buildTokenInfo("123", 1);

      index.addToken("hell", tokenInfo);
      index.addToken("hello", tokenInfo);
      index.addToken("help", tokenInfo);
      index.addToken("held", tokenInfo);
      index.addToken("foo", tokenInfo);
      index.addToken("bar", tokenInfo);

      let tokens = index.expandToken("hel");
      expect(tokens).toEqual(["hell", "hello", "help", "held"]);

      tokens = index.expandToken("hell");
      expect(tokens).toEqual(["hell", "hello"]);

      tokens = index.expandToken("he");
      expect(tokens).toEqual(["hell", "hello", "help", "held"]);

      tokens = index.expandToken("h");
      expect(tokens).toEqual(["hell", "hello", "help", "held"]);
    });

    test("expand a non existing token", () => {
      const index = new InvertedIndex();
      const tokenInfo = buildTokenInfo("123", 1);

      index.addToken("hell", tokenInfo);
      index.addToken("hello", tokenInfo);
      index.addToken("help", tokenInfo);
      index.addToken("held", tokenInfo);
      index.addToken("foo", tokenInfo);
      index.addToken("bar", tokenInfo);

      const tokens = index.expandToken("wax");
      expect(tokens).toEqual([]);
    });
  });

  describe("toJSON()", () => {
    const index = new InvertedIndex();

    expect(index.toJSON()).toEqual({ root: { docs: {}, df: 0 } });

    index.addToken("foo", buildTokenInfo("123", 1));

    expect(index.toJSON()).toEqual({
      root: {
        docs: {},
        df: 0,
        f: {
          df: 0,
          docs: {},
          o: {
            df: 0,
            docs: {},
            o: {
              df: 1,
              docs: { "123": { tf: 1 } },
            },
          },
        },
      },
    });
  });

  describe("#load()", () => {
    const serialisedData: SerializedData = {
      root: {
        docs: {},
        df: 0,
        f: {
          df: 0,
          docs: {},
          o: {
            df: 0,
            docs: {},
            o: {
              df: 1,
              docs: { "123": { tf: 1 } },
            },
          },
        },
      },
    };

    const index = InvertedIndex.load(serialisedData);
    const documents = index.getDocs("foo");

    expect(documents).toEqual({ "123": { tf: 1 } });
  });
});
