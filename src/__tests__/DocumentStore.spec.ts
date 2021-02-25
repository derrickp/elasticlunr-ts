import { DocumentStore, SerializedData } from "../DocumentStore";

describe("DocumentStore", () => {
  const doc = { title: "eggs bread" };
  const multiFieldDoc = {
    title: "godzilla",
    body: "godzilla is king of monsters",
  };

  const key = "foo";
  const multiKey = "bar";

  it("adds document tokens to the store", () => {
    const store = new DocumentStore();
    store.addDoc(key, doc);
    expect(store.getDoc(key)).toEqual(doc);
  });

  describe("default save value", () => {
    it("is true", () => {
      const store = new DocumentStore();
      expect(store.isDocStored).toEqual(true);
    });
  });

  describe("setting the save value in constructor", () => {
    it("sets the value to true when given true", () => {
      const store = new DocumentStore(true);
      expect(store.isDocStored).toEqual(true);
    });

    it("sets the value to false when given", () => {
      const store = new DocumentStore(false);
      expect(store.isDocStored).toEqual(false);
    });
  });

  describe("save is false", () => {
    it("reports isDocStored correctly", () => {
      const store = new DocumentStore(false);
      expect(store.isDocStored).toEqual(false);
    });

    it("reports length correctly", () => {
      const store = new DocumentStore();
      store.addDoc(key, doc);
      expect(store).toHaveLength(1);
    });

    it("reports it has the doc", () => {
      const store = new DocumentStore(false);
      store.addDoc(key, doc);
      expect(store.hasDoc(key)).toEqual(true);
    });

    it("returns undefined when getting doc", () => {
      const store = new DocumentStore(false);
      store.addDoc(key, doc);
      expect(store.getDoc(key)).toBeNull();
    });

    it("removes the doc", () => {
      const store = new DocumentStore(false);

      store.addDoc(key, doc);
      store.removeDoc(key);
      expect(store).toHaveLength(0);
      expect(store.getDoc(key)).toBeNull();
    });

    it("can remove a non-existant doc", () => {
      const store = new DocumentStore(false);
      store.addDoc(key, doc);
      store.removeDoc("8");
      expect(store.getDoc(key)).toBeNull();
    });
  });

  describe("length", () => {
    it("reports length", () => {
      const store = new DocumentStore();
      expect(store).toHaveLength(0);
      store.addDoc(key, doc);
      expect(store).toHaveLength(1);
    });
  });

  describe("addDoc()", () => {
    it("can add a null doc", () => {
      const store = new DocumentStore();
      store.addDoc("thing", null as any);
      expect(store.hasDoc("thing")).toEqual(true);
    });

    it("does not increment length when given it again", () => {
      const store = new DocumentStore();
      expect(store).toHaveLength(0);
      store.addDoc(key, doc);
      store.addDoc(key, doc);
      store.addDoc(key, doc);
      store.addDoc(key, doc);
      expect(store).toHaveLength(1);
    });
  });

  describe("getDoc()", () => {
    it("gets the doc", () => {
      const store = new DocumentStore();
      store.addDoc(key, doc);
      expect(store.getDoc(key)).toEqual({ title: "eggs bread" });
    });

    it("saves and returns a multi-field doc", () => {
      const store = new DocumentStore();
      store.addDoc(multiKey, multiFieldDoc);
      expect(store.getDoc(multiKey)).toEqual({
        title: "godzilla",
        body: "godzilla is king of monsters",
      });
    });

    it("returns undefined for a non-existant doc", () => {
      const store = new DocumentStore();
      expect(store.getDoc(key)).toBeNull();
    });
  });

  describe("hasDoc()", () => {
    it("returns true when it has the doc", () => {
      const store = new DocumentStore();
      expect(store.hasDoc(key)).toEqual(false);
      store.addDoc(key, doc);
      expect(store.hasDoc(key)).toEqual(true);
    });
  });

  describe("removeDoc()", () => {
    it("removes doc and updates length", () => {
      const store = new DocumentStore();
      store.addDoc(key, doc);
      expect(store).toHaveLength(1);
      store.removeDoc(key);
      expect(store).toHaveLength(0);
      expect(store.getDoc(key)).toBeNull();
    });

    it("removing non-existant doc does not change length", () => {
      const store = new DocumentStore();
      store.addDoc(key, doc);
      store.removeDoc(multiKey);
      expect(store).toHaveLength(1);
    });
  });

  describe("addFieldLength()", () => {
    it("adding field length with non-existant docRef does nothing", () => {
      const store = new DocumentStore();
      store.addDoc(key, doc);
      store.addFieldLength("baz", "title", 2);
      expect(store.docInfo).toEqual({});
    });

    it("adds field length correctly", () => {
      const store = new DocumentStore();
      store.addDoc(key, doc);
      store.addFieldLength(key, "title", 2);
      expect(store.getFieldLength(key, "title")).toEqual(2);
    });

    it("can set a length on a non-existant field", () => {
      const store = new DocumentStore();
      store.addDoc(key, doc);
      store.addFieldLength(key, "max", 10);
      expect(store.getFieldLength(key, "max")).toEqual(10);
    });

    it("sets length correctly for multiple fields", () => {
      const store = new DocumentStore();
      store.addDoc(key, doc);
      store.addFieldLength(key, "title", 2);
      store.addFieldLength(key, "body", 10);
      expect(store.getFieldLength(key, "title")).toEqual(2);
      expect(store.getFieldLength(key, "body")).toEqual(10);
    });

    it("removes fieldLength for deleted docs", () => {
      const store = new DocumentStore();
      store.addDoc(key, doc);
      store.addFieldLength(key, "title", 2);
      store.addFieldLength(key, "body", 10);
      store.removeDoc(key);
      expect(store.getFieldLength(key, "title")).toEqual(0);
      expect(store.getFieldLength(key, "body")).toEqual(0);
    });
  });

  describe("getFieldLength()", () => {
    it("returns 0 when given an invalid field", () => {
      const store = new DocumentStore();
      expect(store.getFieldLength(undefined as any, "field")).toEqual(0);
    });

    it("returns 0 when it cannot find docRef", () => {
      const store = new DocumentStore();
      store.addDoc(key, doc);
      store.addFieldLength(key, "title", 2);
      expect(store.getFieldLength(key, "foozbah")).toEqual(0);
    });
  });

  describe("serialization", () => {
    describe("toJSON()", () => {
      it("returns a basic object when nothing saved", () => {
        const store = new DocumentStore();
        expect(store.toJSON()).toEqual({
          docs: {},
          docInfo: {},
          length: 0,
          save: true,
        });
      });

      it("returns saved docs", () => {
        const store = new DocumentStore();
        store.addDoc(key, doc);
        const expected = {
          docs: { foo: { title: "eggs bread" } },
          docInfo: {},
          length: 1,
          save: true,
        };
        expect(store.toJSON()).toEqual(expected);
      });

      describe("serializing with docInfo", () => {
        it("returns the docInfo", () => {
          const store = new DocumentStore();
          store.addDoc(key, doc);
          store.addFieldLength(key, "title", 2);
          const expected = {
            docs: { foo: { title: "eggs bread" } },
            docInfo: { foo: { title: 2 } },
            length: 1,
            save: true,
          };
          expect(store.toJSON()).toEqual(expected);
        });
      });

      describe("without storing", () => {
        it("object added to document store not in serialized", () => {
          const store = new DocumentStore(false);
          store.addDoc(key, doc);
          const expected = {
            docs: { foo: null },
            docInfo: {},
            length: 1,
            save: false,
          };
          expect(store.toJSON()).toEqual(expected);
        });
      });
    });

    describe("loading serialized data", () => {
      it("loads serialzed data", () => {
        const serializedData: SerializedData = {
          length: 1,
          docs: {
            foo: { title: "eggs bread" },
          },
          docInfo: {
            foo: { title: 2, body: 20 },
          },
          save: true,
        };
        const store = DocumentStore.load(serializedData);
        expect(store).toHaveLength(1);
        expect(store.isDocStored).toEqual(true);
        expect(store.getFieldLength(key, "title")).toEqual(2);
        expect(store.getFieldLength(key, "body")).toEqual(20);
        expect(store.getDoc(key)).toEqual({ title: "eggs bread" });
      });

      it("loads data when not storing documents", () => {
        const serializedData: SerializedData = {
          length: 2,
          docs: {
            foo: null,
            bar: null,
          },
          docInfo: {},
          save: false,
        };

        const data = JSON.parse(JSON.stringify(serializedData));

        const store = DocumentStore.load(data);
        expect(store).toHaveLength(2);
        expect(store.isDocStored).toEqual(false);
        expect(store.hasDoc(key)).toEqual(true);
        expect(store.hasDoc(multiKey)).toEqual(true);
        expect(store.getDoc(key)).toBeNull();
        expect(store.getDoc(multiKey)).toBeNull();
      });
    });
  });
});
