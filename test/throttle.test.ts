import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";
import delay from "../src/delay.ts";
import throttle from "../src/throttle.ts";

const fixture = Symbol("fixture");

Deno.test({
  name: "main",
  async fn() {
    const totalRuns = 100;
    const limit = 5;
    const interval = 100;
    const end = timeSpan();
    const throttled = throttle({ limit, interval })(async () => {});

    await Promise.all(
      Array.from({ length: totalRuns })
        .fill(0)
        .map((x) => throttled(x)),
    );

    const totalTime = (totalRuns * interval) / limit;
    t.true(
      inRange(end(), {
        start: totalTime - 200,
        end: totalTime + 200,
      }),
    );
  },
});

Deno.test({
  name: "strict mode",
  async fn() {
    const totalRuns = 100;
    const limit = 5;
    const interval = 100;
    const strict = true;
    const end = timeSpan();
    const throttled = throttle({ limit, interval, strict })(async () => {});

    await Promise.all(
      Array.from({ length: totalRuns })
        .fill(0)
        .map((x) => throttled(x)),
    );

    const totalTime = (totalRuns * interval) / limit;
    t.true(
      inRange(end(), {
        start: totalTime - 200,
        end: totalTime + 200,
      }),
    );
  },
});

Deno.test({
  name: "limits after pause in strict mode",
  async fn() {
    const limit = 10;
    const interval = 100;
    const strict = true;
    const throttled = throttle({ limit, interval, strict })(() => Date.now());
    const pause = 40;
    const promises = [];
    const start = Date.now();

    await throttled();

    await delay(pause);

    for (let i = 0; i < limit + 1; i++) {
      promises.push(throttled());
    }

    const results = await Promise.all(promises);

    for (const [index, executed] of results.entries()) {
      const elapsed = executed - start;
      if (index < limit - 1) {
        t.true(
          inRange(elapsed, { start: pause, end: pause + 15 }),
          "Executed immediately after the pause",
        );
      } else if (index === limit - 1) {
        t.true(
          inRange(elapsed, { start: interval, end: interval + 15 }),
          "Executed after the interval",
        );
      } else {
        const difference = executed - results[index - limit];
        t.true(
          inRange(difference, { start: interval - 10, end: interval + 15 }),
          "Waited the interval",
        );
      }
    }
  },
});

Deno.test({
  name: "limits after pause in windowed mode",
  async fn() {
    const limit = 10;
    const interval = 100;
    const strict = false;
    const throttled = throttle({ limit, interval, strict })(() => Date.now());
    const pause = 40;
    const promises = [];
    const start = Date.now();

    await throttled();

    await delay(pause);

    for (let i = 0; i < limit + 1; i++) {
      promises.push(throttled());
    }

    const results = await Promise.all(promises);

    for (const [index, executed] of results.entries()) {
      const elapsed = executed - start;
      if (index < limit - 1) {
        t.true(
          inRange(elapsed, { start: pause, end: pause + 10 }),
          "Executed immediately after the pause",
        );
      } else {
        t.true(
          inRange(elapsed, { start: interval - 10, end: interval + 10 }),
          "Executed immediately after the interval",
        );
      }
    }
  },
});

Deno.test({
  name: "passes arguments through",
  async fn() {
    const throttled = throttle({ limit: 1, interval: 100 })(async (x) => x);
    t.is(await throttled(fixture), fixture);
  },
});

Deno.test({
  name: "can be aborted",
  async fn() {
    const limit = 1;
    const interval = 10000; // 10 seconds
    const end = timeSpan();
    const throttled = throttle({ limit, interval })(async () => {});

    await throttled();
    const promise = throttled();
    throttled.abort();
    let error;
    try {
      await promise;
    } catch (error_) {
      error = error_;
    }

    t.true(error instanceof throttle.AbortError);
    t.true(end() < 100);
  },
});

Deno.test({
  name: "can be disabled",
  async fn() {
    let counter = 0;

    const throttled = throttle({
      limit: 1,
      interval: 10000,
    })(async () => ++counter);

    t.is(await throttled(), 1);

    const end = timeSpan();

    throttled.isEnabled = false;
    t.is(await throttled(), 2);

    t.true(end() < 200);
  },
});

Deno.test({
  name: "promise rejections are thrown",
  async fn() {
    const throttled = throttle({
      limit: 1,
      interval: 10000,
    })(() => Promise.reject(new Error("Catch me if you can!")));

    await t.throwsAsync(throttled, {
      instanceOf: Error,
      message: "Catch me if you can!",
    });
  },
});

Deno.test({
  name: "`this` is preserved in throttled function",
  async fn() {
    class FixtureClass {
      constructor() {
        this._foo = fixture;
      }

      foo() {
        // If `this` is not preserved by `throttle()`
        // then `this` will be undefined and accesing `this._foo` will throw.
        return this._foo;
      }

      getThis() {
        // If `this` is not preserved by `throttle()`
        // then `this` will be undefined.
        return this;
      }
    }
    FixtureClass.prototype.foo = throttle({ limit: 1, interval: 100 })(
      FixtureClass.prototype.foo,
    );
    FixtureClass.prototype.getThis = throttle({ limit: 1, interval: 100 })(
      FixtureClass.prototype.getThis,
    );

    const thisFixture = new FixtureClass();

    t.is(await thisFixture.getThis(), thisFixture);
    await t.notThrowsAsync(thisFixture.foo());
    t.is(await thisFixture.foo(), fixture);
  },
});
