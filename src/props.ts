// maps a { key:promise } mapped collection to a { key:resolved-promise } mapped collection
// deno-lint-ignore-file no-explicit-any
import { Unpacked } from "./util/types.ts";

export async function props<T extends { [key: string]: Promise<any> }>(
  keyPromiseMap: T,
) {
  const entries = Object.entries(keyPromiseMap);
  type Ret = { [K in keyof T]: Unpacked<T[K]> };
  const acc: Partial<Ret> = {};
  await Promise.all(
    entries.map(([key, pwork]) => {
      return pwork.then((r) => {
        acc[key as keyof T] = r;
      });
    }),
  );
  return acc as Ret;
}

export default props;
