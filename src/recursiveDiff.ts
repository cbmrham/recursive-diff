import { Diff, OperationType, Path, ValueByPath } from "./types";
import { needRecursive, areEqual } from "./utils";

function computeOperation(before: any, after: any): OperationType {
  if (before === undefined && after !== undefined) {
    return "add";
  } else if (before !== undefined && after === undefined) {
    return "delete";
  } else if (!areEqual(before, after)) {
    return "update";
  } else {
    return "same";
  }
}

function getKeys(x: any, y: any) {
  return Array.from(new Set(Object.keys(x).concat(Object.keys(y))));
}

function makeDiff(before: any, after: any, path: string[]) {
  const operation = computeOperation(before, after);
  if (operation === "same") return [];
  return [
    {
      operation,
      path: path.length ? path.join(".") : undefined,
      before: operation !== "add" ? before : undefined,
      after: operation === "add" || operation === "update" ? after : undefined,
    },
  ];
}

function diffRecursive(before: any, after: any, path: any): any {
  if (needRecursive(before, after)) {
    return getKeys(before, after).reduce<any>(
      (acc, value) =>
        acc.concat(
          diffRecursive(before[value], after[value], path.concat(value))
        ),
      []
    );
  } else {
    return makeDiff(before, after, path);
  }
}

export function diff<B, A>(before: B, after: A): Diff<B, A, Path<B | A>>[] {
  return diffRecursive(before, after, []);
}

const getValueByPathImpl = (obj: any, path?: any): any => {
  if (!path) return obj;
  const [key, ...rest] = path.split(".");
  return getValueByPathImpl(obj[key], rest.join("."));
};

export const getValueByPath = <T, P extends Path<T>>(
  obj: T,
  path?: P
): ValueByPath<T, P> => getValueByPathImpl(obj, path) as ValueByPath<T, P>;
