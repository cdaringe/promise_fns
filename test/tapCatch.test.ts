import tapCatch from "../src/tapCatch.ts";
import delay from "../src/delay.ts";
import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";

const tapError = new Error("tap error!");
const fixtureError = new Error("unicorn");

Deno.test({
  name: "catch - ignores tap value",
  async fn() {
    let assertionCount = 0;

    await Promise.reject(fixtureError)
      .catch(
        tapCatch((error: unknown) => {
          assertEquals(error, fixtureError);
          ++assertionCount;
          return "ignored-val";
        }),
      )
      .catch((error) => {
        assertEquals(error, fixtureError);
        ++assertionCount;
      });
    assertEquals(assertionCount, 2);
  },
});

Deno.test({
  name: "catch - does not ignore tap error",
  async fn() {
    let assertionCount = 0;
    await Promise.reject(fixtureError)
      .catch(
        tapCatch(() => {
          throw tapError;
        }),
      )
      .catch((error) => {
        assertEquals(error, tapError);
        ++assertionCount;
      });
    assertEquals(assertionCount, 1);
  },
});

Deno.test({
  name: "catch - waits for tap promise to resolve",
  async fn() {
    let i = 0;
    await Promise.reject(fixtureError)
      .catch(tapCatch(() => delay(10).then(() => ++i)))
      .catch((error: unknown) => {
        assertEquals(error, fixtureError);
        assertEquals(i, 1);
      });
  },
});
