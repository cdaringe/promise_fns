import { Unpacked } from "./util/types.ts";

export async function all<I>(collection: I[]) {
  const out = await Promise.all(collection);
  return out as Unpacked<I>[];
}

export default all;
