import { path, Task } from "./3p.ts";

const readmeFilename = Deno.realPathSync("./readme.md");

export const docs: Task = {
  async fn({ sh, logger }) {
    logger.info(`updating readme`);
    const filenamesRaw = Deno.readDirSync(await Deno.realPath("src"));
    const functionsMeta = [...filenamesRaw]
      .filter((f) => f.isFile)
      .map((f) => ({
        filename: f.name,
        name: path.basename(f.name).replace(/\.ts$/, ""),
        description: Deno.readTextFileSync(`src/${f.name}`)
          .split("\n")[0]!
          .replace(/^\/\//, ""),
      }))
      .sort((a, b) => (a.name < b.name ? -1 : 1));
    const oldReadmeContent = await Deno.readTextFile(readmeFilename);
    const [pre, post] = oldReadmeContent.split(
      /<!-- LINKS-START[.\s\S]*LINKS-END -->/g,
    );
    await Deno.writeTextFile(
      readmeFilename,
      [
        pre,
        `<!-- LINKS-START -->
<!-- this table is auto-generated. see .rad/docs.ts -->
| function | description | links |
| --- | --- | --- |
${
          functionsMeta
            .map(
              ({ filename, description, name }) =>
                `| \`${name}\` | ${description} | [src](./src/${filename}) [test](./test/${name}.test.ts) |`,
            )
            .join("\n")
        }
<!-- LINKS-END -->`,
        post,
      ].join("\n"),
    );
    await sh(`rad format`);
  },
};
