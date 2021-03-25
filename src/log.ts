// Log the resolved value of a promise
import tap from "./tap.ts";
export type Logger<T = unknown> = (message: T) => void;

export default function log<O>(log: Logger = console.log) {
  return tap<O, void>(function logOnTap(value) {
    log(value);
  });
}
