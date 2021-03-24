// maps a collection into a new collection asynchronously
import { Unpacked } from "./util/types.ts";
import { iter, IterOps, PCallback } from "./util/iter.ts";

export function map<I, CB extends PCallback<I, O>, O = Unpacked<Unpacked<CB>>>(
  collection: I[],
  cb: CB,
  opts?: IterOps,
) {
  return iter<I, O>(collection, cb, opts);
}

export default map;
