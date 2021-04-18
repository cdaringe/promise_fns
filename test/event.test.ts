import { EventEmitter } from "./fixture/3p.ts";
import event from "../src/event.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

type TestEvents = {
  foo: [string];
  bar: [number, boolean];
};
class TestEmitter extends EventEmitter<TestEvents> {}

Deno.test({
  name: "event - basic",
  async fn() {
    const emitter = new TestEmitter();
    const p1 = event(emitter, "on", "foo");
    const p2 = event(emitter, "on", "bar");
    setTimeout(() => emitter.emit("foo", "test_foo"), 1);
    setTimeout(() => emitter.emit("bar", 2, true), 1);
    assertEquals(await p1, ["test_foo"]);
    assertEquals(await p2, [2, true]);
  },
});
