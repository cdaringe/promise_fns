export function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function reject<E = Error>(ms: number, err: E) {
  await sleep(ms);
  return Promise.reject(err);
}
export default async function delay<U = void>(ms: number, value?: U) {
  await sleep(ms);
  return value;
}
