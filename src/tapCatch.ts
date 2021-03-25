// Tap into a rejecting promise chain without affecting the rejected value
export default function tapCatch<ErrorType>(
  tapHandler: (error: ErrorType) => unknown,
): (error: ErrorType) => Promise<never> {
  return async function onCatchTap(error) {
    await tapHandler(error);
    throw error;
  };
}
