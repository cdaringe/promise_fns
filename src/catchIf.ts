// Conditional promise catch handler
// deno-lint-ignore-file no-explicit-any

import isErrorConstructor from "./util/is_error_constructor.ts";

interface ErrorConstructor {
  new (message?: string): Error;
}

type Predicate =
  | ErrorConstructor
  | ReadonlyArray<ErrorConstructor>
  | boolean
  | ((error: Error) => boolean | PromiseLike<boolean>);

/**
  Conditional promise catch handler.
  @param predicate - Specify either an `Error` constructor, array of `Error` constructors, `boolean`, or function that returns a promise for a `boolean` or a `boolean`. If the function returns a promise, it's awaited.
  @param catchHandler - Called if `predicate` passes. This is what you would normally pass to `.catch()`.
  @returns A [thunk](https://en.wikipedia.org/wiki/Thunk) that returns a `Promise`.
  @example
  ```
  import pCatchIf = require('p-catch-if');
  // Error constructor
  getData().catch(pCatchIf(TimeoutError, () => retry(getData)));
  // Multiple error constructors
  getData().catch(pCatchIf([NetworkError, TimeoutError], () => retry(getData)));
  // Boolean
  getData().catch(pCatchIf(isProduction, error => recordError(error)));
  // Function
  const hasUnicornMessage = error => error.message.includes('unicorn');
  getData().catch(pCatchIf(hasUnicornMessage, console.error));
  // Promise-returning function
  const handler = error => sendError(error).then(checkResults);
  getData().catch(pCatchIf(handler, console.error));
  // Can also be nested
  const validateMessage = error => error.message === 'Too many rainbows';
  getData().catch(pCatchIf(UnicornError, pCatchIf(validateMessage, console.error)));
  ```
  */
export default function catchIf<T>(
  predicate: Predicate,
  catchHandler: (error: Error) => T,
): (error: Error) => Promise<T> {
  return async function onError(error: Error) {
    if (predicate === true) return catchHandler(error);
    if (Array.isArray(predicate) || isErrorConstructor(predicate)) {
      if (
        [...(Array.isArray(predicate) ? predicate : [predicate])].some(
          (errorConstructor) => error instanceof errorConstructor,
        )
      ) {
        return catchHandler(error);
      }
    } else if (typeof predicate === "function") {
      // cast here to narrow out `ErrorConstructor`, which is a fn. is there a
      // way to narrow out new-ables?
      const isErrorMatchedMaybeP = (predicate as any)(error);
      const isErrorMatched = await Promise.resolve(isErrorMatchedMaybeP);
      if (isErrorMatched) return catchHandler(error);
      throw error;
    }

    throw error;
  };
}
