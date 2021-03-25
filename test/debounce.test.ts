import delay from "../src/delay.ts";
import debounce from "../src/debounce.ts";
import tap from "../src/tap.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

const fixture = Symbol("fixture");

Deno.test({
  name: "single call",
  async fn() {
    const debounced = debounce(async (value) => await value, 100);
    assertEquals(await debounced(fixture), fixture);
  },
});

Deno.test({
  name: "multiple calls",
  async fn() {
    let count = 0;

    const debounced = debounce(async (value) => {
      count++;
      await delay(50);
      return value;
    }, 100);

    const results = await Promise.all(
      [1, 2, 3, 4, 5].map((value) => debounced(value)),
    );

    assertEquals(results, [5, 5, 5, 5, 5]);
    assertEquals(count, 1);

    await delay(200);
    assertEquals(await debounced(6), 6);
  },
});

Deno.test({
  name: "leading option",
  async fn() {
    let count = 0;

    const debounced = debounce(
      async (value) => {
        count++;
        await delay(50);
        return value;
      },
      10,
      { leading: true },
    );

    const results = await Promise.all(
      [1, 2, 3, 4].map((value) => debounced(value)),
    );

    assertEquals(
      results,
      [1, 1, 1, 1],
      "value from the first promise is used without the timeout",
    );
    assertEquals(count, 1);

    await delay(50);
    assertEquals(await debounced(5), 5);
    assertEquals(await debounced(6), 5);
  },
});

Deno.test({
  name: "leading option - does not call input function after timeout",
  async fn() {
    let count = 0;
    const debounced = debounce(
      tap<void>(() => ++count),
      5,
      { leading: true },
    );

    await delay(2);
    await debounced();

    assertEquals(count, 1, "debounce all with leading immediately invoked");
  },
});

Deno.test({
  name:
    "fn execution takes longer than wait duration, fires once per debounced window",
  async fn() {
    let count = 0;
    const debounced = debounce<number[], number>(
      tap(() => ++count),
      10,
    );

    const setOne = [1, 2, 3];
    const setTwo = [4, 5, 6];

    const promiseSetOne = setOne.map((value) => debounced(value));
    await delay(10);
    const promiseSetTwo = setTwo.map((value) => debounced(value));

    const results = await Promise.all([...promiseSetOne, ...promiseSetTwo]);

    assertEquals(results, [3, 3, 3, 6, 6, 6]);
    assertEquals(count, 2);
  },
});

// Factory to create a separate class for each test below
// * Each test replaces methods in the class with a debounced variant,
//   hence the need to start with fresh class for each test.
const createFixtureClass = () =>
  class {
    public _foo: symbol;
    constructor() {
      this._foo = fixture;
    }

    async foo() {
      // If `this` is not preserved by `debounce()` or `debounce.promise()`,
      // then `this` will be undefined and accessing `this._foo` will throw.
      return await this._foo;
    }

    async getThis() {
      // If `this` is not preserved by `debounce()` or `debounce.promise()`,
      // then `this` will be undefined.
      return await this;
    }
  };

const preserveThisCases = [["debounce()", debounce] as const];

for (const [name, debounceFn] of preserveThisCases) {
  Deno.test({
    name: `\`this\` is preserved in ${name} fn`,
    async fn() {
      const FixtureClass = createFixtureClass();
      FixtureClass.prototype.foo = debounceFn(FixtureClass.prototype.foo, 10);
      FixtureClass.prototype.getThis = debounceFn(
        FixtureClass.prototype.getThis,
        10,
      );

      const thisFixture = new FixtureClass();

      assertEquals(await thisFixture.getThis(), thisFixture);
      await thisFixture.foo();
      assertEquals(await thisFixture.foo(), fixture);
    },
  });
}
