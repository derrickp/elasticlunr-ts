import { EventEmitter } from "../EventEmitter";

describe("EventEmitter", () => {
  describe("#addListener()", () => {
    it("calls registered handler when event emitted", () => {
      const handler = jest.fn();
      const emitter = new EventEmitter();

      emitter.addListener(["test"], handler);

      emitter.emit("test");
      expect(handler).toHaveBeenCalledWith("test", undefined);
    });

    it("returns a handle that removes the handler", () => {
      const handler = jest.fn();
      const emitter = new EventEmitter();

      const handle = emitter.addListener(["test"], handler);
      handle.remove();

      emitter.emit("test");
      expect(handler).not.toHaveBeenCalled();
    });

    describe("adding a listener for multiple events", () => {
      it("notifies the listener for each event", () => {
        const emitter = new EventEmitter();

        const handler = jest.fn();

        emitter.addListener(["foo", "bar", "baz"], handler);

        emitter.emit("foo");
        emitter.emit("bar");
        emitter.emit("baz");
        expect(handler).toHaveBeenCalledTimes(3);
      });

      it("handle.remove() removes handler from all events", () => {
        const emitter = new EventEmitter();

        const handler = jest.fn();

        const handle = emitter.addListener(["foo", "bar", "baz"], handler);
        handle.remove();
        emitter.emit("foo");
        emitter.emit("bar");
        emitter.emit("baz");
        expect(handler).not.toHaveBeenCalled();
      });
    });
  });

  describe("emit()", () => {
    it("passes through the arguments to emit", () => {
      const emitter = new EventEmitter();
      const handler = jest.fn();
      emitter.addListener(["test"], handler);
      const args = { foo: true };
      emitter.emit("test", args);
      expect(handler).toHaveBeenCalledWith("test", args);
    });
  });
});
