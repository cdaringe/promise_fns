import catchIf from "../src/catchIf.ts";
import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std@0.90.0/testing/asserts.ts";

const fixture = Symbol("fixture");
const fixtureError = new Error("fixture");
const fixtureRangeError = new RangeError("fixture-range");

Deno.test({
  name: "predicate is true",
  async fn() {
    const result = await Promise.reject(fixtureError).catch(
      catchIf(true, () => fixture),
    );

    assertEquals(result, fixture);
  },
});

Deno.test({
  name: "predicate is false",
  async fn() {
    const result = await Promise.reject(fixtureError)
      .catch(catchIf(false, () => fixture))
      .catch((error) => error);

    assertEquals(result, fixtureError);
  },
});

Deno.test({
  name: "predicate is error constructor and matches error",
  async fn() {
    const result = await Promise.reject(fixtureRangeError).catch(
      catchIf(RangeError, () => fixture),
    );

    assertEquals(result, fixture);
  },
});

Deno.test({
  name: "predicate is error constructor and does not match error",
  async fn() {
    const result = await Promise.reject(fixtureError)
      .catch(catchIf(RangeError, () => fixture))
      .catch((error) => error);

    assertEquals(result, fixtureError);
  },
});

Deno.test({
  name: "predicate is array of error constructors and matches error",
  async fn() {
    const result = await Promise.reject(fixtureRangeError).catch(
      catchIf([ReferenceError, RangeError], () => fixture),
    );

    assertEquals(result, fixture);
  },
});

Deno.test({
  name: "predicate is array of error constructors and does not match error",
  async fn() {
    const result = await Promise.reject(fixtureError)
      .catch(catchIf([ReferenceError, RangeError], () => fixture))
      .catch((error) => error);

    assertEquals(result, fixtureError);
  },
});

Deno.test({
  name: "predicate function returns true",
  async fn() {
    const result = await Promise.reject(fixtureError).catch(
      catchIf(
        () => true,
        () => fixture,
      ),
    );

    assertEquals(result, fixture);
  },
});

Deno.test({
  name:
    "predicate function that returns true should pass error to catch handler",
  async fn() {
    const result = await Promise.reject(fixtureError).catch(
      catchIf(
        () => true,
        (error) => error,
      ),
    );

    assertEquals(result, fixtureError);
  },
});

Deno.test({
  name: "predicate function returns false",
  async fn() {
    const result = await Promise.reject(fixtureError)
      .catch(
        catchIf(
          () => false,
          () => fixture,
        ),
      )
      .catch((error) => error);

    assertEquals(result, fixtureError);
  },
});

Deno.test({
  name: "predicate function returns promise that resolves to true",
  async fn() {
    const result = await Promise.reject(fixtureError).catch(
      catchIf(
        async () => await true,
        () => fixture,
      ),
    );

    assertEquals(result, fixture);
  },
});

Deno.test({
  name: "predicate function returns promise that resolves to false",
  async fn() {
    const result = await Promise.reject(fixtureError)
      .catch(
        catchIf(
          async () => await false,
          () => fixture,
        ),
      )
      .catch((error) => error);

    assertEquals(result, fixtureError);
  },
});

Deno.test({
  name: "predicate function returns promise that resolves to truthy",
  async fn() {
    const result = await Promise.reject(fixtureError)
      .catch(
        catchIf(
          async () => await false,
          () => fixture,
        ),
      )
      .catch((error) => error);

    assertEquals(result, fixtureError);
  },
});
