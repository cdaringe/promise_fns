// deno-lint-ignore-file no-explicit-any
export type Unpacked<T> = T extends (infer U)[] ? U
  : T extends (...args: any[]) => infer U ? U
  : T extends Promise<infer U> ? U
  : T;

export type Head<T> = T extends [infer Head, ...infer _Tail] ? Head : never;
export type Tail<T> = T extends [infer _Head, ...infer Tail] ? Tail : never;
export type Body<T> = T extends [...infer B, infer L] ? B : never;
export type Last<T> = T extends [...infer Body, infer L] ? L : never;

export type Fn = (...args: any[]) => any;
export type FnWithCb =
  | ((cb: Fn) => any)
  | ((arg0: any, cb: Fn) => any)
  | ((arg0: any, arg1: any, cb: Fn) => any)
  | ((arg0: any, arg1: any, arg2: any, cb: Fn) => any)
  | ((arg0: any, arg1: any, arg2: any, arg3: any, cb: Fn) => any)
  | ((arg0: any, arg1: any, arg2: any, arg3: any, arg4: any, cb: Fn) => any);
