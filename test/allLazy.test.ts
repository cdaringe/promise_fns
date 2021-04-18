import allLazy from "../src/allLazy.ts";
import delay from "../src/delay.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

const createLazyXyz = () => [
  () => delay(10).then(() => "x_lazy"),
  () => delay(0).then(() => "y_lazy"),
  () => delay(5).then(() => "z_lazy"),
];

Deno.test({
  name: "all - lazy, async collection mapper",
  async fn() {
    const results = await allLazy(
      ["x", "y", "z"].map((char) => () => Promise.resolve(`${char}_lazy`)),
    );
    assertEquals(
      !!results[0].match,
      true,
      "TS assertion only - string inferred",
    );
    assertEquals(results, ["x_lazy", "y_lazy", "z_lazy"]);
  },
});

Deno.test({
  name: "all - lazy, sync collection mapper",
  async fn() {
    // string
    const strResult = await allLazy(createLazyXyz());
    assertEquals(strResult, ["x_lazy", "y_lazy", "z_lazy"]);
    // number
    const numResult = await allLazy([1, 2].map((num) => () => num));
    assertEquals(numResult, [1, 2]);
  },
});
