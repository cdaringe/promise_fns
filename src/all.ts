// resolve an eager or lazy collection of promises
// deno-lint-ignore-file no-explicit-any
import { Fn, Unpacked } from "./util/types.ts";
import { iter, IterOps } from "./util/iter.ts";

export function all<
  I extends any,
  CB extends (it: I) => any,
  O = Unpacked<ReturnType<CB>>
>(collection: I[], cb?: CB, opts?: IterOps) {
  const map = cb || (((i) => i) as CB);
  return iter<any, O>(collection, map, opts);
}

export default all;
