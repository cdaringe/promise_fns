import map from "../src/map.ts";
import {
  assertArrayIncludes,
  assertEquals,
} from "https://deno.land/std@0.90.0/testing/asserts.ts";

Deno.test({
  name: "map - base",
  async fn() {
    const mapper = (it: number, i: number) => it + i;
    const res = await map([], mapper);
    assertEquals(res, []);
  },
});

Deno.test({
  name: "map - simple add",
  async fn() {
    const res = await map([1, 2, 3], (it, i) => Promise.resolve(it + i));
    assertEquals(res, [1, 3, 5]);
  },
});

Deno.test({
  name: "map - IO type change",
  async fn() {
    const res = await map([1, 2], String);
    assertEquals(res, ["1", "2"]);
  },
});

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

Deno.test({
  name: "map - out-of-order resolution, order maintained",
  async fn() {
    const res = await map([10, 1, 5], (it) => sleep(it).then(() => it));
    assertEquals(res, [10, 1, 5]);
  },
});

Deno.test({
  name:
    "map - out-of-order resolution, order maintained with concurrency limit",
  async fn() {
    let count = 0;
    const withCount = async (v: number) => {
      ++count;
      assertArrayIncludes(
        [0, 1, 2],
        [count],
        `${count} active workers. expected only 2`,
      );
      await sleep(v);
      --count;
    };
    const res = await map([10, 5, 1], (it) => withCount(it).then(() => it), {
      concurrency: 2,
    });
    assertEquals(res, [10, 5, 1]);
  },
});
