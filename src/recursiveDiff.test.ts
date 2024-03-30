import { diff } from "./recursiveDiff";

describe("recursiveDiff", () => {
  describe("when root", () => {
    describe("was changed notiong", () => {
      it("should returns blank list", () => {
        expect(diff(1, 1)).toEqual([]);
      });
    });
    describe("was changed values", () => {
      it("should returns list updated", () => {
        expect(diff(1, 2)).toEqual([
          { operation: "update", path: undefined, before: 1, after: 2 },
        ]);
      });
    });

    describe("changed dates nothing", () => {
      it("should returns blank list", () => {
        const date = new Date();
        expect(diff(date, date)).toEqual([]);
      });
    });

    describe("changed dates", () => {
      const x = new Date("2024-01-01");
      const y = new Date("2024-01-02");
      it("should returns list updated", () => {
        expect(diff(x, y)).toEqual([
          { operation: "update", path: undefined, before: x, after: y },
        ]);
      });
    });
  });

  describe("when object", () => {
    describe("was changed nothing", () => {
      it("should returns blank list", () => {
        const x = { a: 1 };
        expect(diff(x, x)).toEqual([]);
      });
    });

    describe("was changed values", () => {
      const x = { a: 1 };
      const y = { a: 2 };
      it("should returns list updated", () => {
        expect(diff(x, y)).toEqual([
          { operation: "update", path: "a", before: 1, after: 2 },
        ]);
      });
    });

    describe("was added", () => {
      const x = { a: 1 };
      const y = { a: 1, b: 2 };
      it("should returns list added", () => {
        expect(diff(x, y)).toEqual([
          { operation: "add", path: "b", before: undefined, after: 2 },
        ]);
      });
    });

    describe("was deleted", () => {
      const x = { a: 1, b: 2 };
      const y = { a: 1 };
      it("should returns list deleted", () => {
        expect(diff(x, y)).toEqual([
          { operation: "delete", path: "b", before: 2, after: undefined },
        ]);
      });
    });

    describe("that have list", () => {
      describe("was changed nothing", () => {
        const x = { list: [1, 2, 3] };
        it("should returns blank list", () => {
          expect(diff(x, x)).toEqual([]);
        });
      });

      describe("was changed values", () => {
        const x = { list: [1, 2, 3] };
        const y = { list: [1, 2, 4] };
        it("should returns list updated", () => {
          expect(diff(x, y)).toEqual([
            { operation: "update", path: "list.2", after: 4, before: 3 },
          ]);
        });
      });

      describe("was added", () => {
        const x = { list: [1, 2, 3] };
        const y = { list: [1, 2, 3, 4] };
        it("should returns list added", () => {
          expect(diff(x, y)).toEqual([
            {
              operation: "add",
              path: "list.3",
              before: undefined,
              after: 4,
            },
          ]);
        });
      });

      describe("was deleted", () => {
        const x = { list: [1, 2, 3, 4] };
        const y = { list: [1, 2, 3] };
        it("should returns list deleted", () => {
          expect(diff(x, y)).toEqual([
            {
              operation: "delete",
              path: "list.3",
              before: 4,
              after: undefined,
            },
          ]);
        });
      });

      describe("that have object", () => {
        describe("was changed nothing", () => {
          const x = {
            nested: { a: 1, b: 2, c: 3, list: [1, 2, 3, { a: "test" }] },
          };
          it("should returns blank list", () => {
            expect(diff(x, x)).toEqual([]);
          });
        });

        describe("ignores function values", () => {
          const x = {
            func: () => 1,
          };
          const y = {
            func: () => 2,
          };
          it("should returns blank list", () => {
            expect(diff(x, y)).toEqual([]);
          });
        });

        describe("was changed values", () => {
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
          it("should returns list updated", () => {
            console.log(diff(x, y));
            expect(diff(x, y)).toEqual([
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
            ]);
          });
        });
      });
    });
  });
});
