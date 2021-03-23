import type { Task, Tasks } from "https://deno.land/x/rad/src/mod.ts";

const format: Task = `deno fmt`;
const test: Task = `deno test -A`;

export const tasks: Tasks = {
  ...{ f: format, format },
  ...{ t: test, test },
};
