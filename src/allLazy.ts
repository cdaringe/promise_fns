// deno-lint-ignore-file no-explicit-any
import { Unpacked } from "./util/types.ts";
import { iter, IterOps } from "./util/iter.ts";
import all from "./all.ts";

export async function allLazy<I extends () => any>(
  collection: I[],
  opts?: IterOps,
) {
  type O = Unpacked<ReturnType<I>>;
  const res: O[] = [];
  await iter<I, O>(
    collection,
    (thunk) => {
      const work = thunk();
      res.push(work);
      return work;
    },
    opts,
  );
  return all(res);
}

export default allLazy;
