// create a promise that sleeps for some milliseconds then rejects
import { sleep } from "./delay.ts";

export default async function reject<E = Error>(ms: number, err: E) {
  await sleep(ms);
  return Promise.reject(err);
}
