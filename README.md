# recursive-diff

This is a simple script that recursively diffs two Object.

## Installation

```bash
npm install @cbmrham/recursive-diff
```

## Usage

```javascript
import { recursiveDiff } from "@cbmrham/recursive-diff";

const x = {
  nested: {
    a: "1",
    b: 2,
    c: 3,
    str: "before",
    bool: true,
    list: [{ 1: "test" }, { 2: "before" }, 3],
  },
};
const y = {
  nested: {
    a: "1",
    b: 3,
    d: 4,
    str: "after",
    bool: false,
    list: [{ 1: "test" }, { 2: "after" }, 3, 4],
  },
};
const diff = diff(x, y);
```

The diff constant becomes an array of objects that represent the changes between x and y, like so:

```javascript
[
  {
    operation: "update",
    path: "nested.b",
    before: 2,
    after: 3,
  },
  {
    operation: "delete",
    path: "nested.c",
    before: 3,
    after: undefined,
  },
  {
    operation: "update",
    path: "nested.str",
    before: "before",
    after: "after",
  },
  {
    operation: "update",
    path: "nested.bool",
    before: true,
    after: false,
  },
  {
    operation: "update",
    path: "nested.list.1.2",
    before: "before",
    after: "after",
  },
  {
    operation: "add",
    path: "nested.list.3",
    before: undefined,
    after: 4,
  },
  {
    operation: "add",
    path: "nested.d",
    before: undefined,
    after: 4,
  },
];
```

And, TypeScript is supported, so you can use the diff constant like so:

you can add a type assertion to the diff function

```typescript
type X = {
  nested: {
    foo: string;
    bar: string;
    list: Array<{ foo: string }>;
  };
};
type Y = {
  nested: {
    foo: string;
    baz: string;
    list: Array<{ foo: string }>;
  };
};
const x: X = {
  nested: {
    foo: "1",
    bar: "before",
    list: [{ foo: "test" }],
  },
};
const y: Y = {
  nested: {
    foo: "1",
    baz: "after",b
    list: [{ foo: "test" }],
  },
};
const result = diff(x, y);
result.forEach((r) => {
  if (r.path === "nested.foo") {
    console.log(r.before); // r.before type becomes string | undefined
    console.log(r.after); // r.after type becomes string | undefined
  } else if (r.path === "nested.baz" && r.operation === "add") {
    console.log(r.before); // r.before type becomes undefined
    console.log(r.after); // r.after type becomes string
  } else if (r.path === "nested.list.0.foo" && r.operation === "delete") {
    console.log(r.before); // r.before type becomes string
    console.log(r.after); // r.after type becomes undefined
  }
});
```
