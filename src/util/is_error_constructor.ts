// deno-lint-ignore-file no-explicit-any
export default function isErrorConstructor(constructor: any) {
  return (
    constructor === Error ||
    ("prototype" in constructor && constructor.prototype instanceof Error)
  );
}
