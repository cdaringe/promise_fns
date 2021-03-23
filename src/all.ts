// deno-lint-ignore-file no-explicit-any
import { Unpacked } from "./types.ts";
import { iter, IterOps, PCallback } from "./iter.ts";

export function all<
  T extends Promise<any>[],
  CB extends PCallback<any, any>,
  O = Unpacked<Unpacked<CB>>,
>(
  collection: T,
  opts?: IterOps,
) {
  return iter<any, O>(collection, (i) => i, opts);
}

export default all;
