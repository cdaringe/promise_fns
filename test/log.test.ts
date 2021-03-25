import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import log from "../src/log.ts";

const fixture = Symbol("fixture");

Deno.test({
  name: "log()",
  async fn() {
    let assertionCount = 0;
    const result = await Promise.resolve(fixture).then(
      log((value) => {
        assertEquals(value, fixture);
        ++assertionCount;
      }),
    );
    // typescript reflected type assert
    assertEquals(typeof result.description!, "string");
    assertEquals(result, fixture);
    ++assertionCount;
    assertEquals(assertionCount, 2);
  },
});
