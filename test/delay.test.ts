import delay from "../src/delay.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

Deno.test({
  name: "delay - without return value",
  async fn() {
    const results = await delay(0);
    assertEquals(results, undefined);
  },
});

Deno.test({
  name: "delay - with return value",
  async fn() {
    const results = await delay(0, 1);
    assertEquals(results, 1);
  },
});
