# promise_fns

Promise utility functions for Deno.

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Inspired by the sindresorhus
[promise-fun](https://github.com/sindresorhus/promise-fun) collection. Parity with the node `promise-fun` library is not guaranteed.

**Features**:

- each function is independently importable
- all APIs are type-safe first

## usage

```ts

```

## functions

<!-- LINKS-START -->
<!-- this table is auto-generated. see .rad/docs.ts -->

| function        | description                                                                                                                             | links                                                                  |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| all             | resolve an eager or lazy collection of promises                                                                                         | [src](./src/all.ts) [test](./test/all.test.ts)                         |
| delay           | create a promise that sleeps for some milliseconds then resolves                                                                        | [src](./src/delay.ts) [test](./test/delay.test.ts)                     |
| delayReject     | create a promise that sleeps for some milliseconds then rejects                                                                         | [src](./src/delayReject.ts) [test](./test/delayReject.test.ts)         |
| map             | maps a collection into a new collection asynchronously                                                                                  | [src](./src/map.ts) [test](./test/map.test.ts)                         |
| promisify       | converts a node-style callback function into a promisified function, returning the result after `err`, per `(err, result) => void`      | [src](./src/promisify.ts) [test](./test/promisify.test.ts)             |
| promisify-multi | converts a node-style callback function into a promisified function, returning all results after `err`, per `(err, ...results) => void` | [src](./src/promisify-multi.ts) [test](./test/promisify-multi.test.ts) |
| props           | maps a { key:promise } mapped collection to a { key:resolved-promise } mapped collection                                                | [src](./src/props.ts) [test](./test/props.test.ts)                     |
| queue           | creates a queue that allows users to add work. queue resolves when no work is outstanding                                               | [src](./src/queue.ts) [test](./test/queue.test.ts)                     |

<!-- LINKS-END -->
