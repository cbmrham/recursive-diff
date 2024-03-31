import { Path, ValueByPath } from "./types";

// these cases writes test for types, so it's not necessary to run the code but to check the type errors.
describe("Types", () => {
  it("check the type of Path", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type cases = [
      Expect<Equal<undefined, Path<string>>>,
      Expect<Equal<undefined | "foo", Path<{ foo: string }>>>,
      Expect<
        Equal<undefined | "foo" | "foo.bar", Path<{ foo: { bar: string } }>>
      >,
      Expect<
        Equal<
          undefined | "0" | "1" | "1.foo",
          Path<readonly ["a", { foo: string }]>
        >
      >,
      Expect<Equal<undefined | `${number}`, Path<string[]>>>,
      Expect<
        Equal<
          undefined | `${number}` | `${number}.foo` | `${number}.foo.bar`,
          Path<{ foo: { bar: boolean } }[]>
        >
      >,
      Expect<
        Equal<
          undefined | "foo" | `foo.${number}` | `foo.${number}.bar`,
          Path<{ foo: { bar: number }[] }>
        >
      >,
    ];
  });
  it("check the type of PathValue", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type cases = [
      Expect<Equal<string, ValueByPath<string, undefined>>>,
      Expect<Equal<{ foo: string }, ValueByPath<{ foo: string }, undefined>>>,
      Expect<Equal<"foo", ValueByPath<["foo", "bar"], "0">>>,
      Expect<Equal<string, ValueByPath<string[], "0">>>,
      Expect<Equal<string, ValueByPath<{ foo: { bar: string } }, "foo.bar">>>,
      Expect<Equal<string, ValueByPath<["f", { foo: string }], "1.foo">>>,
      Expect<
        Equal<{ bar: number }[], ValueByPath<{ foo: { bar: number }[] }, "foo">>
      >,
      Expect<
        Equal<{ bar: number }, ValueByPath<{ foo: { bar: number }[] }, "foo.0">>
      >,
      Expect<
        Equal<number, ValueByPath<{ foo: { bar: number }[] }, "foo.0.bar">>
      >,
    ];
  });
});

type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;
