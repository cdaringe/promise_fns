import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import logCatch from "../src/logCatch.ts";

const fixtureError = new Error("tap_catch_fixture");

Deno.test({
  name: "logCatch()",
  async fn() {
    let assertionCount = 0;

    const logger = (toLog: unknown) => {
      assertEquals(toLog, fixtureError.stack);
      ++assertionCount;
    };

    await Promise.reject(fixtureError)
      .catch(logCatch(logger))
      .catch((error) => {
        assertEquals(error.message, fixtureError.message);
        ++assertionCount;
      });

    assertEquals(assertionCount, 2);
  },
});
