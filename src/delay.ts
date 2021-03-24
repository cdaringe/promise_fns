// create a promise that sleeps for some milliseconds then resolves

export function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function delay<U>(ms: number): Promise<void>;
function delay<U>(ms: number, value: U): Promise<U>;
async function delay<U>(ms: number, value?: U) {
  await sleep(ms);
  if (value) return value;
  return;
}

export default delay;
