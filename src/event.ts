// Await an event completion in a promise
import type { Fn } from "./util/types.ts";

export default function promisifyEvent<
  EventName extends string,
  M extends string,
  E extends Record<M, (n: EventName, cb: Fn) => void>,
  Args = E extends Record<
    M,
    (a: EventName, cb: (...args: infer Z) => void) => void
  > ? Z
    : never,
>(emitter: E, method: M, eventName: EventName) {
  return new Promise<Args>(function awaitEventEmit(resolve) {
    emitter[method](eventName, function onEmit() {
      const args = ([...arguments] as unknown) as Args;
      resolve(args);
    });
  });
}
