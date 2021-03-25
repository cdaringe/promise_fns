# promise_fns

Promise utility functions for Deno.

[![main](https://github.com/cdaringe/promise_fns/actions/workflows/main.yml/badge.svg)](https://github.com/cdaringe/promise_fns/actions/workflows/main.yml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Inspired by the sindresorhus
[promise-fun](https://github.com/sindresorhus/promise-fun) collection. Parity
with the node `promise-fun` library is not guaranteed.

**Features**:

- each function is independently importable
- all typesafe, type reflecting APIs
- concurrency control for most collection iterating functions
- debuggable. simplified source, named functions (so your stack trace is
  legible!)

## usage

You can import any individual function as follows:

```ts
import fn from "https://deno.land/x/promise_fns/src/FUNCTION_NAME.ts";
fn(...)
```

All functions are listed in the [functions table](#functions).

A full example:

```ts
import delay from "https://deno.land/x/promise_fns/src/delay.ts";
const delayedTwo = await delay(100, 2);
console.log(1 + delayedTwo); // 3
```

## functions

<!-- LINKS-START -->
<!-- this table is auto-generated. see .rad/docs.ts -->

| function         | description                                                                                                                             | links                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `all`            | resolve an eager or lazy collection of promises                                                                                         | [src](./src/all.ts) [test](./test/all.test.ts)                       |
| `catchIf`        | Conditional promise catch handler                                                                                                       | [src](./src/catchIf.ts) [test](./test/catchIf.test.ts)               |
| `debounce`       | [Debounce](https://css-tricks.com/debouncing-throttling-explained-examples/) promise-returning & async functions                        | [src](./src/debounce.ts) [test](./test/debounce.test.ts)             |
| `delay`          | create a promise that sleeps for some milliseconds then resolves                                                                        | [src](./src/delay.ts) [test](./test/delay.test.ts)                   |
| `delayReject`    | create a promise that sleeps for some milliseconds then rejects                                                                         | [src](./src/delayReject.ts) [test](./test/delayReject.test.ts)       |
| `event`          | Await an event completion in a promise                                                                                                  | [src](./src/event.ts) [test](./test/event.test.ts)                   |
| `if`             | Conditional promise chains                                                                                                              | [src](./src/if.ts) [test](./test/if.test.ts)                         |
| `log`            | Log the resolved value of a promise                                                                                                     | [src](./src/log.ts) [test](./test/log.test.ts)                       |
| `logCatch`       | Log the rejected value of a promise                                                                                                     | [src](./src/logCatch.ts) [test](./test/logCatch.test.ts)             |
| `map`            | maps a collection into a new collection asynchronously                                                                                  | [src](./src/map.ts) [test](./test/map.test.ts)                       |
| `promisify`      | converts a node-style callback function into a promisified function, returning the result after `err`, per `(err, result) => void`      | [src](./src/promisify.ts) [test](./test/promisify.test.ts)           |
| `promisifyMulti` | converts a node-style callback function into a promisified function, returning all results after `err`, per `(err, ...results) => void` | [src](./src/promisifyMulti.ts) [test](./test/promisifyMulti.test.ts) |
| `props`          | maps a { key:promise } mapped collection to a { key:resolved-promise } mapped collection                                                | [src](./src/props.ts) [test](./test/props.test.ts)                   |
| `queue`          | creates a queue that allows users to add work. queue resolves when no work is outstanding                                               | [src](./src/queue.ts) [test](./test/queue.test.ts)                   |
| `tap`            | Tap into a resolving promise chain without affecting the resolved value                                                                 | [src](./src/tap.ts) [test](./test/tap.test.ts)                       |
| `tapCatch`       | Tap into a rejecting promise chain without affecting the rejected value                                                                 | [src](./src/tapCatch.ts) [test](./test/tapCatch.test.ts)             |

<!-- LINKS-END -->

More functions are on their way.

## contributing

Wanting to add more _great stuff?_. See
[.github/contributing.md](.github/contributing.md)
