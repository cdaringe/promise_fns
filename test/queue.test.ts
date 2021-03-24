import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import delay from "../src/delay.ts";
import createQueue from "../src/queue.ts";

Deno.test({
  name: "queue - basic",
  async fn() {
    const emittedResults: number[] = [];
    const workSleepMs = [0, 10, 2];
    const works = workSleepMs.map((ms) => () => delay(ms).then(() => ms));
    const { add, queue, subscribe } = createQueue<number>({ concurrency: 2 });
    subscribe((v) => emittedResults.push(v));
    for (const work of works) add(work);
    const result = await queue;
    assertEquals(result, undefined);
    assertEquals(
      emittedResults,
      /* concurrency 2 allowed 2 to emit before 10 */ [0, 2, 10],
    );
  },
});

Deno.test({
  name: "queue - resolves without work",
  async fn() {
    const emittedResults: number[] = [];
    const workSleepMs = [0, 10, 2];
    const workerFns = workSleepMs.map((ms) => () => delay(ms).then(() => ms));
    const { add, queue, subscribe } = createQueue<number>({ concurrency: 2 });
    subscribe((v) => emittedResults.push(v));
    await delay(0);
    workerFns.forEach(add);
    const result = await queue;
    assertEquals(result, undefined);
    assertEquals(
      emittedResults,
      /* queue has already resolved due to delay */ [],
    );
  },
});
