// Tap into a resolving promise chain without affecting the resolved value

export default function tap<O, HandlerResult = unknown>(
  onTap: (value: O) => HandlerResult,
): (value: O) => Promise<O> {
  return async function handleTap(value) {
    await onTap(value);
    return value;
  };
}
