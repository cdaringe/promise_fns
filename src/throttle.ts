// [Throttle](https://css-tricks.com/debouncing-throttling-explained-examples/) promise-returning & async functions
// deno-lint-ignore-file no-explicit-any

type PromiseResolve<ValueType> = ValueType extends PromiseLike<infer ValueType>
  ? Promise<ValueType>
  : Promise<ValueType>;

type ThrottledFunction<Argument extends readonly unknown[], ReturnValue> = (
  ...args: Argument
) => PromiseResolve<ReturnValue>;
interface Options {
  /**
  Maximum number of calls within an `interval`.
  */
  readonly limit: number;

  /**
  Timespan for `limit` in milliseconds.
  */
  readonly interval: number;

  /**
  Use a strict, more resource intensive, throttling algorithm. The default algorithm uses a windowed approach that will work correctly in most cases, limiting the total number of calls at the specified limit per interval window. The strict algorithm throttles each call individually, ensuring the limit is not exceeded for any interval.
  @default false
  */
  readonly strict?: boolean;
}

export default function throttle({ limit, interval, strict }: Options) {
  const queue = new Map();

  let currentTick = 0;
  let activeCount = 0;

  function windowedDelay() {
    const now = Date.now();

    if (now - currentTick > interval) {
      activeCount = 1;
      currentTick = now;
      return 0;
    }

    if (activeCount < limit) {
      activeCount++;
    } else {
      currentTick += interval;
      activeCount = 1;
    }

    return currentTick - now;
  }

  const strictTicks: number[] = [];

  function strictDelay() {
    const now = Date.now();

    if (strictTicks.length < limit) {
      strictTicks.push(now);
      return 0;
    }

    const earliestTime = strictTicks!.shift()! + interval;

    if (now >= earliestTime) {
      strictTicks.push(now);
      return 0;
    }

    strictTicks.push(earliestTime);
    return earliestTime - now;
  }

  const getDelay = strict ? strictDelay : windowedDelay;

  return function createThrottledFunction<
    Argument extends readonly unknown[],
    ReturnValue,
  >(userFn: (...args: Argument) => ReturnValue) {
    const throttled: ThrottledFunction<
      Argument,
      ReturnValue
    > = function onThrottledFnCall(this: any, ...args: Argument) {
      let timeout = -1;
      return new Promise<ReturnValue>((resolve, reject) => {
        const execute = () => {
          resolve(userFn.bind(this)(...args));
          queue.delete(timeout);
        };

        timeout = setTimeout(execute, getDelay());

        queue.set(timeout, reject);
      }) as PromiseResolve<ReturnValue>;
    };
    return throttled;
  };
}
