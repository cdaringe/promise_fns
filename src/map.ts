// maps a collection into a new collection asynchronously
// deno-lint-ignore-file no-explicit-any
import { Unpacked } from "./util/types.ts";
import { iter, IterOps, PCallback } from "./util/iter.ts";

export function map<
  T extends any[],
  CB extends PCallback<any, any>,
  I = Unpacked<T>,
  O = Unpacked<Unpacked<CB>>,
>(collection: T, cb: PCallback<I, O>, opts?: IterOps) {
  return iter<I, O>(collection, cb, opts);
}

export default map;
