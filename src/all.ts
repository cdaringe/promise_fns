// resolve an eager or lazy collection of promises
// deno-lint-ignore-file no-explicit-any
import { Fn, Unpacked } from "./util/types.ts";
import { iter, IterOps } from "./util/iter.ts";

export function all<I extends any[], CB extends (it: Unpacked<I>) => any>(
  collection: I,
  cb?: CB,
  opts?: IterOps,
) {
  const map = cb || ((i: Unpacked<I>) => i);
  return iter<any, ReturnType<CB>>(collection, map, opts);
}

export default all;
