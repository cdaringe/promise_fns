import props from "../src/props.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

Deno.test({
  name: "props - base",
  async fn() {
    const res = await props({});
    assertEquals(res, {});
  },
});

Deno.test({
  name: "props - simple",
  async fn() {
    const a = "a";
    const res = await props({ a: Promise.resolve(a) });
    assertEquals(res, { a });
  },
});

Deno.test({
  name: "props - multi-key",
  async fn() {
    const a = "a";
    const res = await props({ a: Promise.resolve(a), b: Promise.resolve(2) });
    assertEquals(res.b, 2);
    assertEquals(res.a, a);
  },
});
