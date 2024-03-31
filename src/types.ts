/**
 * Represents the type of operation.
 * It can be "add", "update", "delete", or "same".
 */
export type OperationType = "add" | "update" | "delete" | "same";

/**
 * Represents the value at a specific path in an object.
 * @template T - The type of the object.
 * @template P - The path in the object.
 * If P is undefined, the type is T.
 * If P is a string representing a path in the object, the type is the value at that path.
 */
export type ValueByPath<
  T,
  P extends Path<T> | undefined = undefined,
> = P extends undefined
  ? T
  : T extends any
  ? P extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? R extends Path<T[K]>
        ? ValueByPath<T[K], R>
        : never
      : K extends `${number}`
      ? T extends ReadonlyArray<infer V>
        ? ValueByPath<V, R & Path<V>>
        : never
      : never
    : P extends keyof T
    ? T[P]
    : P extends `${number}`
    ? T extends ReadonlyArray<infer V>
      ? V
      : never
    : never
  : never;

/**
 * Helper type for recursively constructing paths through a type.
 * This actually constructs the strings and recurses into nested
 * object types.
 *
 * See {@link Path}
 */
type PathImpl<K extends string | number, V, TraversedTypes> = V extends
  | Primitive
  | NativeObject
  ? `${K}`
  : true extends AnyIsEqual<TraversedTypes, V>
  ? `${K}`
  : `${K}` | `${K}.${PathInternal<V, TraversedTypes | V>}`;
/**
 * Helper type for recursively constructing paths through a type.
 * This obscures the internal type param TraversedTypes from exported contract.
 *
 * See {@link Path}
 */
type PathInternal<T, TraversedTypes = T> = T extends ReadonlyArray<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKeys<T>]-?: K extends string | number
          ? PathImpl<K, T[K], TraversedTypes>
          : never;
      }[TupleKeys<T>]
    : PathImpl<number, V, TraversedTypes>
  : {
      [K in keyof T]-?: K extends string | number
        ? PathImpl<K, T[K], TraversedTypes>
        : never;
    }[keyof T];
/**
 * Type which eagerly collects all paths through a type
 * @typeParam T - type which should be introspected
 * @example
 * ```
 * Path<{foo: {bar: string}}> = 'foo' | 'foo.bar'
 * ```
 */
export type Path<T> = T extends Primitive | NativeObject
  ? undefined
  : undefined | PathInternal<T>;

/**
 * Represents the difference between two objects at a specific path.
 * @template B - The type of the "before" object.
 * @template A - The type of the "after" object.
 * @template P - The path in the objects.
 * If P is any, the type is never.
 * If P is a valid path, the type is an object representing the difference.
 */
export type Diff<B, A, P extends Path<B | A> = Path<B | A>> = P extends any
  ?
      | {
          operation: "add";
          path: P;
          before: undefined;
          after: ValueByPath<A | B, P>;
        }
      | {
          operation: "delete";
          path: P;
          before: ValueByPath<A | B, P>;
          after: undefined;
        }
      | {
          operation: "update";
          path: P;
          before: ValueByPath<A | B, P>;
          after: ValueByPath<A | B, P>;
        }
  : never;

/**
 * Represents a primitive value or a native object.
 */
export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

/**
 * Represents a native object.
 */
export type NativeObject = Date | FileList | File;

/**
 * Checks whether the type is any.
 * @template T - The type to check.
 * @returns true if the type is any, false otherwise.
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * Checks whether a type is a tuple type.
 * @template T - The type to check.
 * @returns true if the type is a tuple type, false otherwise.
 */
export type IsTuple<T extends ReadonlyArray<any>> = number extends T["length"]
  ? false
  : true;

/**
 * Represents the keys of a tuple type.
 * @template T - The tuple type.
 * @returns The keys of the tuple type.
 */
export type TupleKeys<T extends ReadonlyArray<any>> = Exclude<
  keyof T,
  keyof any[]
>;

/**
 * Checks whether two types are equal.
 * @template T1 - The first type.
 * @template T2 - The second type.
 * @returns true if the types are equal, false otherwise.
 */
export type IsEqual<T1, T2> = T1 extends T2
  ? (<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2 ? 1 : 2
    ? true
    : false
  : false;

/**
 * Checks whether any type in T1 is equal to T2.
 * @template T1 - The type to check.
 * @template T2 - The type to compare against.
 * @returns true if any type in T1 is equal to T2, false otherwise.
 */
export type AnyIsEqual<T1, T2> = T1 extends T2
  ? IsEqual<T1, T2> extends true
    ? true
    : never
  : never;
