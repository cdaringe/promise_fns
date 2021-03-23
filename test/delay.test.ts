import delay, { reject } from "../src/delay.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

Deno.test({
  name: "delay",
  async fn() {
    const v = await delay(0, 1);
    assertEquals(v, 1);
  },
});

Deno.test({
  name: "delay - reject",
  async fn() {
    try {
      await reject(0, new Error("test"));
      assertEquals(true, false);
    } catch (err) {
      assertEquals((err as Error).message, "test");
    }
  },
});
