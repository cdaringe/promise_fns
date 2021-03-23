import promisifyMulti from "../src/promisify-multi.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";
import { writeFileCb } from "./fixture/promisify-cbs.ts";

Deno.test({
  name: "promisifyMulti",
  async fn() {
    const testFn = (a: number, cb: (err: null | Error, v: number) => void) =>
      cb(null, a + 1);
    const testFnP = promisifyMulti(testFn);
    const res = await testFnP(3);
    assertEquals(res, [4]);
  },
});

Deno.test({
  name: "promisifyMulti - variadic",
  async fn() {
    const testFn = (
      a: number,
      cb: (err: undefined | null | Error, a0?: number, a1?: string) => void,
    ) => cb(null, a + 1, "test_string");
    const testFnP = promisifyMulti(testFn);
    const res = await testFnP(3);
    assertEquals(res, [4, "test_string"]);
  },
});

Deno.test({
  name: "promisifyMulti - integration",
  async fn() {
    const tempFilename = await Deno.makeTempFile();
    const writeFile = promisifyMulti(writeFileCb);
    const isOk = await writeFile(tempFilename, "test");
    assertEquals(isOk, [true], "writeFile callback promisified");
  },
});
