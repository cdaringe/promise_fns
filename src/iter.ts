export type IterOps = IterOpInOrder & IterOpConcurrency;

export type IterOpInOrder = { inOrder?: boolean };
export type IterOpConcurrency = { concurrency?: number };

export type PCallback<I, O> = (input: I, i: number) => Promise<O>;

type LimitWip<O> = Map<number, Promise<O | Error>>;

/**
 * Control iteration. This function is intentionally complex for synchronizing
 * state for speed. Easier data structures are certainly available. But, this is a
 * general purpose iter, so we have the speed!
 */
export function iter<I, O>(
  collection: I[],
  cb: PCallback<I, O>,
  ops: IterOps = {},
) {
  const { concurrency = Infinity } = ops;
  const ok: O[] = [];
  let okCount = 0;
  const wip: LimitWip<O> = new Map();
  const /* mut */ toProcess = [...collection];
  return new Promise<O[]>(function iterLimit(res, rej) {
    let isFailed = false;
    function fill() {
      if (!toProcess.length && !wip.size) return res(ok);
      while (toProcess.length && wip.size < concurrency) {
        const idx = okCount + wip.size;
        const it = toProcess.shift()!;
        wip.set(
          idx,
          cb(it, idx).then(
            (res) => {
              ok[idx] = res;
              ++okCount;
              wip.delete(idx);
              if (!isFailed) fill();
              return res;
            },
            (err) => {
              isFailed = true;
              rej(err);
              return err as Error;
            },
          ),
        );
      }
    }
    fill();
  });
}
