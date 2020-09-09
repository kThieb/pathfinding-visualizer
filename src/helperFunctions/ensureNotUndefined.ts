// This function is here to ensure that a value is not undefined (especially when using arrays).
export function ensure<T>(
  argument: T | undefined | null,
  message: string = "This value was promised to be there."
): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }
  return argument;
}
