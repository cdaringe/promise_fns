import { docs, Task, Tasks } from "./.rad/mod.ts";
const format: Task = `deno fmt --unstable --ignore=node_modules`;
const test: Task = `deno test -A`;
const lint: Task = `deno lint --unstable`;
const check: Task = {
  dependsOn: [format, test, lint],
  dependsOnSerial: true,
  async fn({ sh }) {
    await sh(`git diff --exit-code`).catch(() => {
      throw new Error(`git diff has diffs! no diffs allowed, in CI ;)`);
    });
  },
};

export const tasks: Tasks = {
  ...docs,
  ...{ l: lint, lint },
  ...{ f: format, format },
  ...{ t: test, test },
  ...{ c: check, check },
};
