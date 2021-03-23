export const writeFileCb = (
  filename: string,
  content: string,
  cb: (err: null | Error, ok: boolean) => void,
) => {
  Deno.writeTextFile(filename, content).then(
    () => cb(null, true),
    (err) => cb(err, false),
  );
};
