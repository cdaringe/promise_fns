import isErrorConstructor from "../../src/util/is_error_constructor.ts";
import { assertEquals as eq } from "https://deno.land/std@0.80.0/testing/asserts.ts";

class CustomError extends RangeError {
  constructor() {
    super();
    this.name = "CustomError";
  }
}

Deno.test({
  name: "isErrorConstructor - cases",
  fn() {
    eq(isErrorConstructor(Error), true);
    eq(isErrorConstructor(RangeError), true);
    eq(isErrorConstructor(SyntaxError), true);
    eq(isErrorConstructor(CustomError), true);
    eq(
      isErrorConstructor(() => {}),
      false,
    );
    eq(isErrorConstructor({}), false);
    eq(isErrorConstructor(""), false);
    eq(isErrorConstructor(new Error()), false);

    eq(isErrorConstructor(new CustomError()), false);
  },
});
