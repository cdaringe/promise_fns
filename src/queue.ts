// creates a queue that allows users to add work. queue resolves when no work is outstanding

import { iter, IterOps } from "./util/iter.ts";

export type CreateQueueOptions = IterOps;

export default function createQueue<O = unknown>(opts: CreateQueueOptions) {
  type Work = () => Promise<O>;
  type SubcriptionEventHandler = (output: O) => void;
  const subscribers: SubcriptionEventHandler[] = [];
  const subscribe = (cb: SubcriptionEventHandler) => subscribers.push(cb);
  const emit = (o: O) => subscribers.forEach((subscriber) => subscriber(o));
  let toProcess: Work[] = [];

  async function awaitQueueSettled(): Promise<void> {
    const processed = await iter(
      toProcess,
      async function onQueueTick(work) {
        const result = await work();
        emit(result);
        return result;
      },
      opts
    );
    toProcess = toProcess.slice(processed.length);
    if (toProcess.length) return awaitQueueSettled();
  }

  return {
    add: (input: Work) => toProcess.push(input),
    queue: awaitQueueSettled(),
    subscribe,
  };
}
