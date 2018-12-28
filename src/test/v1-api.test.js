import test from "../test.md";
import markdownReader, { lint } from "../markdownReader";

describe("linting", () => {
  test("main example markdown should pass lint", () => {
    const expected = "no issues found";
    const actual = lint(test);
    expect(actual).toThrow(expected);
  });
});
