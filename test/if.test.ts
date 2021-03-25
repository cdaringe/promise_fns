import pIf from "../src/if.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

const fixture = Symbol("fixture");

Deno.test({
  name: "if - base case",
  async fn() {
    const value = await Promise.resolve(fixture).then(
      pIf(
        true,
        () => "if",
        () => "else"
      )
    );
    assertEquals(value, "if");
  },
});

Deno.test({
  name: "if - else",
  async fn() {
    const value = await Promise.resolve(fixture).then(
      pIf(
        false,
        () => "if",
        () => "else"
      )
    );
    assertEquals(value, "else");
  },
});

Deno.test({
  name: "if - passthrough",
  async fn() {
    const value = await Promise.resolve(fixture).then(pIf(false, () => "if"));
    assertEquals(value, fixture);
  },
});

Deno.test({
  name: "if - composability",
  async fn() {
    const value = await Promise.resolve(fixture).then(
      pIf(
        true,
        pIf(
          false,
          () => "if",
          () => "else"
        )
      )
    );
    assertEquals(value, "else");
  },
});

Deno.test({
  name: "if - condition can be a function",
  async fn() {
    const isEmpty = (array: unknown[]) => array.length === 0;

    const valueA = await Promise.resolve([]).then(
      pIf(isEmpty, (array) => array.concat(42))
    );

    const valueB = await Promise.resolve([1]).then(
      pIf(isEmpty, (array) => array.concat(42))
    );

    assertEquals(valueA, [42]);
    assertEquals(valueB, [1]);
  },
});

Deno.test({
  name: "if - condition can be an async function",
  async fn() {
    const valueA = await Promise.resolve([] as number[]).then(
      pIf(
        async () => await true,
        (array) => array.concat(42)
      )
    );

    const valueB = await Promise.resolve([1]).then(
      pIf(
        async () => await false,
        (array) => array.concat(42)
      )
    );

    assertEquals(valueA, [42]);
    assertEquals(valueB, [1]);
  },
});
