import delayReject from "../src/delayReject.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

Deno.test({
  name: "delay - reject",
  async fn() {
    try {
      await delayReject(0, new Error("test"));
      assertEquals(true, false);
    } catch (err) {
      assertEquals((err as Error).message, "test");
    }
  },
});
