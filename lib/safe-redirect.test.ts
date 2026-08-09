import { describe, expect, it } from "vitest";
import { safeNext } from "./safe-redirect";

describe("safeNext", () => {
  it("keeps site-relative paths", () => {
    expect(safeNext("/blog/a-post")).toBe("/blog/a-post");
    expect(safeNext("/blog/a-post?from=feed")).toBe("/blog/a-post?from=feed");
    expect(safeNext("/")).toBe("/");
  });

  it("falls back home when there is nothing to return to", () => {
    expect(safeNext(undefined)).toBe("/");
    expect(safeNext(null)).toBe("/");
    expect(safeNext("")).toBe("/");
  });

  it("refuses anything that would leave the site", () => {
    expect(safeNext("//evil.com")).toBe("/");
    expect(safeNext("/\\evil.com")).toBe("/");
    expect(safeNext("https://evil.com")).toBe("/");
    expect(safeNext("http://evil.com")).toBe("/");
    expect(safeNext("javascript:alert(1)")).toBe("/");
    expect(safeNext("evil.com")).toBe("/");
  });

  it("refuses control characters", () => {
    expect(safeNext("/blog\nLocation: https://evil.com")).toBe("/");
    expect(safeNext("/blog\r\nSet-Cookie: a=b")).toBe("/");
  });
});
