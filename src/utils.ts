/**
 * Checks if a value is of type Date.
 * @param x - The value to check.
 * @returns True if the value is of type Date, false otherwise.
 */
const isDate = (x: unknown): x is Date => x instanceof Date;

/**
 * Checks if a value is an iterable object.
 * @param x - The value to check.
 * @returns True if the value is an iterable object, false otherwise.
 */
export const isIterableObject = (x: unknown) => {
  const type = Object.prototype.toString.call(x);
  return type === "[object Object]";
};

/**
 * The native types in JavaScript.
 */
const nativeTypes = [
  "number",
  "boolean",
  "string",
  "bigint",
  "symbol",
  "undefined",
  "function",
  "object",
] as const;

/**
 * The value object types in JavaScript.
 */
const valueObjectTypes = ["null", "date"] as const;

/**
 * The ignored types in JavaScript.
 */
const ignoredTypes = ["function", "symbol"];

/**
 * The possible types in JavaScript.
 */
type Types = (typeof nativeTypes)[number] | (typeof valueObjectTypes)[number];

/**
 * Gets the type of a value.
 * @param value - The value to get the type of.
 * @returns The type of the value.
 */
export function getType(value: any): Types {
  if (value === null) return "null";
  if (isDate(value)) return "date";
  const nativeType = typeof value;
  if (nativeTypes.includes(nativeType)) return nativeType;
  return "object";
}

/**
 * Checks if two values are equal.
 * @param before - The first value.
 * @param after - The second value.
 * @returns True if the values are equal, false otherwise.
 */
export function areEqual(before: unknown, after: unknown) {
  // ignored types treated as true.
  if (
    ignoredTypes.includes(typeof before) ||
    ignoredTypes.includes(typeof after)
  )
    return true;
  if (typeof before !== typeof after) return false;
  if (isDate(before) && isDate(after)) {
    return before.getTime() === after.getTime();
  } else if (before === null) {
    return true;
  } else {
    return before === after;
  }
}

/**
 * Checks if recursive traversal is needed for two values.
 * @param before - The first value.
 * @param after - The second value.
 * @returns True if recursive traversal is needed, false otherwise.
 */
export function needRecursive(before: any, after: any) {
  const typeX = getType(before);
  const typeY = getType(after);
  return typeX === typeY && typeX === "object";
}
