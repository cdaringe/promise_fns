import all from "../src/all.ts";
import delay from "../src/delay.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

const createXyz = () => [delay(10).then(() => "x"), delay(0).then(() => "y"), delay(5).then(() => "z")];
Deno.test({
  name: "all",
  async fn() {
    const v = await all(createXyz());
    assertEquals(v, ["x", "y", "z"]);
  },
});
