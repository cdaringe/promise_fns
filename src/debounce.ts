// [Debounce](https://css-tricks.com/debouncing-throttling-explained-examples/) promise-returning & async functions

// deno-lint-ignore-file no-explicit-any no-this-alias
export interface Options {
  /**
  Call the `fn` on the [leading edge of the timeout](https://css-tricks.com/debouncing-throttling-explained-examples/#article-header-id-1). Meaning immediately, instead of waiting for `wait` milliseconds.
  @default false
  */
  readonly leading?: boolean;
}

export default function debounce<ArgumentsType extends unknown[], ReturnType>(
  fn: (...fnArgs: ArgumentsType) => PromiseLike<ReturnType> | ReturnType,
  wait: number,
  options: Options = {},
): (...debouncedFnArgs: ArgumentsType) => Promise<ReturnType> {
  type Ret = PromiseLike<ReturnType> | ReturnType;

  let leadingValue: Ret;
  let timer: null | number = null;
  let resolveList: ((arg: Ret) => unknown)[] = [];

  return function handleDebouncedCall(this: any, ...arguments_) {
    const self = this;
    return new Promise(function resolveOnDebounceSettle(resolve) {
      const runImmediately = options.leading && !timer;

      clearTimeout(timer as number);

      timer = setTimeout(function onDebouceDurationTick() {
        timer = null;
        const result = options.leading
          ? leadingValue
          : fn.apply(self, arguments_);
        for (resolve of resolveList) resolve(result);
        resolveList = [];
      }, wait);

      if (runImmediately) {
        leadingValue = fn.apply(self, arguments_);
        resolve(leadingValue);
        if (!resolveList.length) clearTimeout(timer as number);
      } else {
        resolveList.push(resolve);
      }
    });
  };
}
