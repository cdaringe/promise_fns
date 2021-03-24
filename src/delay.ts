// create a promise that sleeps for some milliseconds then resolves

export function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export default async function delay<U = void>(ms: number, value?: U) {
  await sleep(ms);
  return value;
}
