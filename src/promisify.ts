// converts a node-style callback function into a promisified function, returning the result after `err`, per `(err, result) => void`
// deno-lint-ignore-file no-explicit-any
import { Body, FnWithCb, Last, Tail, Head } from "./util/types.ts";

export default function promisify<T extends FnWithCb>(toPromisify: T) {
  type Cb = Last<Parameters<T>>;
  type CbArgs = Parameters<Cb>;
  return function asPromise(
    ...argsWithoutCb: Body<Parameters<T>>
  ): Promise<Head<Tail<CbArgs>>> {
    return new Promise(function (resolve, reject) {
      // ts cannot narrow FbWithCb's union correctly full well. any escape!
      (toPromisify as any)(...argsWithoutCb, function onCb(...cbArgs: CbArgs) {
        const [err, ...results] = cbArgs;
        err ? reject(err) : resolve(results[0] as any);
      });
    });
  };
}
