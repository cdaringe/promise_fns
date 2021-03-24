import promisify from "../src/promisify.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";
import { writeFileCb } from "./fixture/promisify-cbs.ts";

Deno.test({
  name: "promisify",
  async fn() {
    const testFn = (a: number, cb: (err: null | Error, v: number) => void) =>
      cb(null, a + 1);
    const testFnP = promisify(testFn);
    const res = await testFnP(3);
    assertEquals(res, 4);
  },
});

Deno.test({
  name: "promisify - variadic",
  async fn() {
    const testFn = (
      a: number,
      cb: (err: undefined | null | Error, a0: number, a1?: string) => void,
    ) => cb(null, a + 1, "test_string");
    const testFnP = promisify(testFn);
    const res = await testFnP(3);
    assertEquals(res, 4);
  },
});

Deno.test({
  name: "promisify - integration",
  async fn() {
    const tempFilename = await Deno.makeTempFile();
    const writeFile = promisify(writeFileCb);
    const isOk = await writeFile(tempFilename, "test");
    assertEquals(isOk, true, "writeFile callback promisified");
  },
});
