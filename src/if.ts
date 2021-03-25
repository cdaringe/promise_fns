// Conditional promise chains

export default function pIf<
  ValueType,
  DoIfReturnType,
  DoElseReturnType = ValueType,
>(
  condition: boolean | ((value: ValueType) => boolean | PromiseLike<boolean>),
  doIf: (value: ValueType) => DoIfReturnType | PromiseLike<DoIfReturnType>,
  doElse?: (
    value: ValueType,
  ) => DoElseReturnType | PromiseLike<DoElseReturnType>,
) {
  return async function conditionallyExecute(
    value: ValueType,
  ): Promise<ValueType | DoIfReturnType | DoElseReturnType> {
    const isExecutingDoBranch =
      (typeof condition === "function" ? await condition(value) : condition) ===
        true;
    return isExecutingDoBranch ? doIf(value) : doElse ? doElse(value) : value;
  };
}
