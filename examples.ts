import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
const delayEcho = (ms: number) => sleep(ms).then(() => ms);

import all from "./src/all.ts";
const res = await all([delayEcho(5), delayEcho(1), delayEcho(3)]);
assertEquals(res, [5, 1, 3]);
