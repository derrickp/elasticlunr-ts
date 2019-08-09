import { Handle } from "./Handle";

type EventCallback = (name: string, event: any) => void;

export class EventEmitter {
  private _handlers: Map<string, EventCallback[]> = new Map();
  constructor() {}

  addListener(names: string[], callback: EventCallback): Handle {
    for (const name of names) {
      if (!this._handlers.has(name)) {
        this._handlers.set(name, []);
      }
      (this._handlers.get(name) as EventCallback[]).push(callback);
    }

    return {
      remove: () => {
        for (const name of names) {
          const registered = this._handlers.get(name) as EventCallback[];
          const index = registered.indexOf(callback);
          if (index >= 0) {
            registered.splice(index, 1);
            this._handlers.set(name, registered);
          }
        }
      }
    };
  }

  emit(name: string, event?: any): void {
    if (!this._handlers.has(name)) {
      return;
    }

    const registered = this._handlers.get(name) as EventCallback[];
    for (const callback of registered) {
      callback(name, event);
    }
  }
}
