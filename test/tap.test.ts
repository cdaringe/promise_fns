import tap from "../src/tap.ts";
import delay from "../src/delay.ts";
import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";

const fixture = Symbol("unicorn");
const tapError = new Error("tap error!");

Deno.test({
  name: "ignores tap value",
  async fn() {
    const value = await Promise.resolve(fixture).then(
      tap((tapValue) => {
        assertEquals(tapValue, fixture);
        return "ignored-val";
      }),
    );

    assertEquals(value, fixture);
  },
});

Deno.test({
  name: "does not ignore tap error",
  async fn() {
    await Promise.resolve(fixture)
      .then(
        tap(() => {
          throw tapError;
        }),
      )
      .catch((error) => {
        assertEquals(error, tapError);
      });
  },
});

Deno.test({
  name: "async tap promise resolves before outer promise",
  async fn() {
    let i = 0;
    const value = await Promise.resolve(fixture).then(
      tap(() => delay(10).then(() => ++i)),
    );
    assertEquals(i, 1, "async tap effect processed");
    assertEquals(value, fixture);
  },
});
