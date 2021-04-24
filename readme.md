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

resolve a collection of promises. it's just
[Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

[src](./src/all.ts) [test](./test/all.test.ts)

```ts {group: demo, file: {name: "readme.ts", autoRemove: true}}
// eager
import all from "./src/all.ts";
console.log(await all([countFiles("."), testIsFile("readme.md")]));
```

```txt {skipRun: true, isExecutionOutput: true}
[ 13, true ]
```

### allLazy

resolve a lazy collection of promises. that is, execute and resolve a collection
of thunks that return promises.

[src](./src/allLazy.ts) [test](./test/allLazy.test.ts)

```ts {group: demo}
import allLazy from "./src/allLazy.ts";
console.log(
  await allLazy([() => countFiles("test"), () => testIsFile("test")])
);
```

```txt {skipRun: true, isExecutionOutput: true}
[ 19, false ]
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
    at file:///home/cdaringe/src/promise-fns/readme.ts:20:37
Error: 3
    at file:///home/cdaringe/src/promise-fns/readme.ts:21:37
Error: 5
    at file:///home/cdaringe/src/promise-fns/readme.ts:19:37
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
      Math.random() > 1 / 1e9,
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

### logCatch

Log the rejected value of a promise

[src](./src/logCatch.ts) [test](./test/logCatch.test.ts)

```ts {group: demo}
import createLogCatch from "./src/logCatch.ts";
await Promise.reject(new Error("something terrible has happened"))
  .catch(createLogCatch())
  .catch(() => null);
```

```txt {skipRun: true, isExecutionOutput: true}
Error: something terrible has happened
    at file:///home/cdaringe/src/promise-fns/readme.ts:43:22
```

### map

maps a collection into a new collection asynchronously

[src](./src/map.ts) [test](./test/map.test.ts)

```ts {group: demo}
import map from "./src/map.ts";
const mapped = await map(["readme.md", "tacos.now"], testIsFile);
console.log(mapped);
```

```txt {skipRun: true, isExecutionOutput: true}
[ true, false ]
```

### promisify

converts a node-style callback function into a promisified function, returning
the result after `err`, per `(err, result) => void`

[src](./src/promisify.ts) [test](./test/promisify.test.ts)

```ts {group: demo}
import promisify from "./src/promisify.ts";
type OldSkoolFn = (cb: (err: Error | null, result: string) => void) => void;
const cbStyleFn: OldSkoolFn = (cb) => cb(null, "yippy. skippy.");
const coolFn = promisify(cbStyleFn);
console.log(await coolFn());
```

```txt {skipRun: true, isExecutionOutput: true}
yippy. skippy.
```

### promisifyMulti

converts a node-style callback function into a promisified function, returning
all results after `err`, per `(err, ...results) => void`

[src](./src/promisifyMulti.ts) [test](./test/promisifyMulti.test.ts)

```ts {group: demo}
import promisifyMulti from "./src/promisifyMulti.ts";
type OldSkoolFnMulti = (
  cb: (err: Error | null, ...results: string[]) => void
) => void;
const cbStyleMultiFn: OldSkoolFnMulti = (cb) => cb(null, "uno", "dos", "tres");
const coolMultiFn = promisifyMulti(cbStyleMultiFn);
console.log(await coolMultiFn());
```

```txt {skipRun: true, isExecutionOutput: true}
[ "uno", "dos", "tres" ]
```

### props

maps a { key:promise } mapped collection to a `{ key:resolved-promise }` mapped
collection

[src](./src/props.ts) [test](./test/props.test.ts)

```ts {group: demo}
import props from "./src/props.ts";
console.log(
  await props({
    pbAndJ: delay(1).then(() => "incredible"),
    subway: delay(3).then(() => "legally not bread in ireland"),
    cubano: delay(0).then(() => "oooooh baby!"),
  }).then((result) => `PB and J is ${result.pbAndJ}`)
);
```

```txt {skipRun: true, isExecutionOutput: true}
PB and J is incredible
```

### queue

creates a queue that allows users to add work. queue resolves when no work is
outstanding

[src](./src/queue.ts) [test](./test/queue.test.ts)

```ts {group: demo}
import createQueue from "./src/queue.ts";
const plannedWork = [5, 0, 3];
const { add, queue, subscribe } = createQueue<number>({ concurrency: 1 });
subscribe((v) => console.log(`completed work: ${v}`));
for (const ms of plannedWork) {
  console.log(`adding work ${ms} to queue`);
  const work = () => delay(ms).then(() => ms);
  add(work);
}
const result = await queue;
```

```txt {skipRun: true, isExecutionOutput: true}
adding work 5 to queue
adding work 0 to queue
adding work 3 to queue
completed work: 5
completed work: 0
completed work: 3
```

### tap

Tap into a resolving promise chain without affecting the resolved value

[src](./src/tap.ts) [test](./test/tap.test.ts)

```ts {group: demo}
import tap from "./src/tap.ts";
await countFiles(".").then(tap((n) => console.log(`found ${n} files`)));
```

```txt {skipRun: true, isExecutionOutput: true}
found 13 files
```

### tapCatch

tap into a rejecting promise chain without affecting the rejected value

[src](./src/tapCatch.ts) [test](./test/tapCatch.test.ts)

```ts {group: demo}
import tapCatch from "./src/tapCatch.ts";
await countFiles("/bogus")
  .catch(tapCatch(() => console.error(`count files failed, but its all good`)))
  .catch(() => 0);
```

```txt {skipRun: true, isExecutionOutput: true}
count files failed, but its all good
```

**More functions are on their way!**

#### Demo support functions

The demo functions used in the above demos are defined as follows:

```ts {group: demo}
async function countFiles(dirname: string) {
  let i = 0;
  for await (const _ of Deno.readDir(dirname)) ++i;
  return i;
}
function testIsFile(filename: string): Promise<boolean> {
  return Deno.stat(filename)
    .then(({ isFile }) => isFile)
    .catch(() => false);
}
```

## contributing

Wanting to add more _great stuff?_. See
[.github/contributing.md](.github/contributing.md)
