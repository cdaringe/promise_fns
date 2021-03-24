import all from "../src/all.ts";
import delay from "../src/delay.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

const createXyz = () => [
  delay(10).then(() => "x"),
  delay(0).then(() => "y"),
  delay(5).then(() => "z"),
];

Deno.test({
  name: "all - eager, sync input",
  async fn() {
    const results = await all(["x", "y", "z"]);
    assertEquals(results, ["x", "y", "z"]);
  },
});

Deno.test({
  name: "all - eager, async input",
  async fn() {
    const results = await all(createXyz());
    assertEquals(results, ["x", "y", "z"]);
  },
});

Deno.test({
  name: "all - lazy, sync collection mapper",
  async fn() {
    const results = await all(["x", "y", "z"], (char) => `${char}_lazy`);
    assertEquals(results, ["x_lazy", "y_lazy", "z_lazy"]);
  },
});

Deno.test({
  name: "all - lazy, async collection mapper",
  async fn() {
    const results = await all(
      createXyz(),
      async (asyncChar) => `${await asyncChar}_lazy`,
    );
    assertEquals(results, ["x_lazy", "y_lazy", "z_lazy"]);
  },
});
