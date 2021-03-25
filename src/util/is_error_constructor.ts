// deno-lint-ignore-file no-explicit-any
export default function isErrorConstructor(constructor: any) {
  return (
    constructor === Error ||
    (constructor !== undefined && constructor.prototype instanceof Error)
  );
}
