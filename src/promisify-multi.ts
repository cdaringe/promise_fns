// deno-lint-ignore-file no-explicit-any
import { Body, FnWithCb, Last, Tail } from "./types.ts";

export default function promisifyMulti<T extends FnWithCb>(toPromisify: T) {
  type Cb = Last<Parameters<T>>;
  type CbArgs = Parameters<Cb>;
  return function asPromise(
    ...argsWithoutCb: Body<Parameters<T>>
  ): Promise<Tail<CbArgs>> {
    return new Promise(function (resolve, reject) {
      // ts cannot narrow FbWithCb's union correctly full well. any escape!
      (toPromisify as any)(...argsWithoutCb, function onCb(...cbArgs: CbArgs) {
        const [err, ...results] = cbArgs;
        err ? reject(err) : resolve(results as any);
      });
    });
  };
}
