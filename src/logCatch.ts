// Log the rejected value of a promise
import tapCatch from "./tapCatch.ts";
import type { Logger } from "./log.ts";

export default function logCatch(log: Logger = console.log) {
  return tapCatch(function logOnTapCatch(err) {
    let toLog = err;
    if (err instanceof Error && err.stack) toLog = err.stack;
    log(toLog);
  });
}
