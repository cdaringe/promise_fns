# promise_fns

Promise utility functions for Deno.

[![main](https://github.com/cdaringe/promise_fns/actions/workflows/main.yml/badge.svg)](https://github.com/cdaringe/promise_fns/actions/workflows/main.yml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Inspired by the sindresorhus
[promise-fun](https://github.com/sindresorhus/promise-fun) collection. Parity
with the node `promise-fun` library is not guaranteed.

**Features**:

- functions are independently importable
- type safe, type reflecting APIs
- concurrency control for most collection iterating functions
- debuggable. simplified source, named functions (so your stack trace is
  legible!)

## Usage

You can import any individual function as follows:

```ts {skipRun: true}
import fn from "https://deno.land/x/promise_fns/src/FUNCTION_NAME.ts";
fn(...)
```

All functions are listed in the [functions table](#functions).

A full example:

```ts {skipRun: true}
import delay from "https://deno.land/x/promise_fns/src/delay.ts";
const delayedTwo = await delay(100, 2);
console.log(1 + delayedTwo); // 3
```

## Functions

### all

resolve an eager or lazy collection of promises

[src](./src/all.ts) [test](./test/all.test.ts)

```ts {group: demo, file: {name: "readme.ts", autoRemove: false}}
import all from "./src/all.ts";
console.log(await all([countFiles("."), testIsFile("readme.md")]));
```

```txt {skipRun: true, isExecutionOutput: true}
[ 11, true ]
```

### catchIf

conditional promise catch handler

[src](./src/catchIf.ts) [test](./test/catchIf.test.ts)

```ts {group: demo }
import catchIf from "./src/catchIf.ts";
const useZeroOnMissing = catchIf(
  (err) => !!err?.message.match(/No such file/),
  () => 0
);
const filesInBogusDir = await countFiles("/bogus/directory")
  .then(console.log)
  .catch(useZeroOnMissing);
console.log({ filesInBogusDir });
```

```txt {skipRun: true, isExecutionOutput: true}
{ filesInBogusDir: 0 }
```

### delay

create a promise that sleeps for some milliseconds then resolves

[src](./src/delay.ts) [test](./test/delay.test.ts)

```ts {group: demo}
import delay from "./src/delay.ts";
const delay5 = delay(5).then(() => console.log(5));
const delay1 = delay(1).then(() => console.log(1));
const delay3 = delay(3).then(() => console.log(3));
await all([delay5, delay1, delay3]);
```

```txt {skipRun: true, isExecutionOutput: true}
1
3
5
```

### delayReject

create a promise that sleeps for some milliseconds then rejects

[src](./src/delayReject.ts) [test](./test/delayReject.test.ts)

```ts {group: demo}
import delayReject from "./src/delayReject.ts";
const delayReject5 = delayReject(5, new Error(`${5}`)).catch(console.error);
const delayReject1 = delayReject(1, new Error(`${1}`)).catch(console.error);
const delayReject3 = delayReject(3, new Error(`${3}`)).catch(console.error);
await all([delayReject5, delayReject1, delayReject3]);
```

```txt {skipRun: true, isExecutionOutput: true}
Error: 1
    at file:///Users/cdaringe/src/promise_fns/readme.ts:16:37
Error: 3
    at file:///Users/cdaringe/src/promise_fns/readme.ts:17:37
Error: 5
    at file:///Users/cdaringe/src/promise_fns/readme.ts:15:37
```

### event

await an event completion in a promise

[src](./src/event.ts) [test](./test/event.test.ts)

```ts {group: demo}
import event from "./src/event.ts";
import { EventEmitter } from "./test/fixture/3p.ts";
class TestEmitter extends EventEmitter<{ foo: [string] }> {}
const emitter = new TestEmitter();
const resolvesOnEvent = event(emitter, "on", "foo");
emitter.emit("foo", "bar");
console.log({ emittedValue: await resolvesOnEvent });
```

```txt {skipRun: true, isExecutionOutput: true}
{ emittedValue: [ "bar" ] }
```

### if

conditional promise chains

[src](./src/if.ts) [test](./test/if.test.ts)

```ts {group: demo}
import pIf from "./src/if.ts";
console.log({
  youReceived: await Promise.resolve("big money!").then(
    pIf(
      Math.random() > 0.001,
      (prize) => `congrats, ${prize}`,
      () => "sorry, zero bucks :("
    )
  ),
});
```

```txt {skipRun: true, isExecutionOutput: true}
{ youReceived: "congrats, big money!" }
```

### log

log the resolved value of a promise

[src](./src/log.ts) [test](./test/log.test.ts)

```ts {group: demo}
import createPromiseLogger from "./src/log.ts";
const pLog = createPromiseLogger<number>(console.info);
await Promise.resolve(1)
  .then(pLog)
  .then((v) => v + 1)
  .then(pLog);
```

```txt {skipRun: true, isExecutionOutput: true}
1
2
```

| | `logCatch` | Log the rejected value of a promise | [src](./src/logCatch.ts)
[test](./test/logCatch.test.ts) | | `map` | maps a collection into a new
collection asynchronously | [src](./src/map.ts) [test](./test/map.test.ts) | |
`promisify` | converts a node-style callback function into a promisified
function, returning the result after `err`, per `(err, result) => void` |
[src](./src/promisify.ts) [test](./test/promisify.test.ts) | | `promisifyMulti`
| converts a node-style callback function into a promisified function, returning
all results after `err`, per `(err, ...results) => void` |
[src](./src/promisifyMulti.ts) [test](./test/promisifyMulti.test.ts) | | `props`
| maps a { key:promise } mapped collection to a { key:resolved-promise } mapped
collection | [src](./src/props.ts) [test](./test/props.test.ts) | | `queue` |
creates a queue that allows users to add work. queue resolves when no work is
outstanding | [src](./src/queue.ts) [test](./test/queue.test.ts) | | `tap` | Tap
into a resolving promise chain without affecting the resolved value |
[src](./src/tap.ts) [test](./test/tap.test.ts) | | `tapCatch` | Tap into a
rejecting promise chain without affecting the rejected value |
[src](./src/tapCatch.ts) [test](./test/tapCatch.test.ts) |

More functions are on their way.

#### Demo support functions

The demo functions used above are defined as follows:

```ts {group: demo}
async function countFiles(dirname: string) {
  let i = 0;
  for await (const _ of Deno.readDir(dirname)) ++i;
  return i;
}
function testIsFile(filename: string) {
  return Deno.stat(filename).then(({ isFile }) => isFile);
}
function isFolder(filename: string) {
  return Deno.stat(filename).then(({ isDirectory }) => isDirectory);
}
```

## contributing

Wanting to add more _great stuff?_. See
[.github/contributing.md](.github/contributing.md)
