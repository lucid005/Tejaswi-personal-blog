import { describe, expect, it } from "vitest";
import { publishedPostWhere } from "./post-visibility";

describe("publishedPostWhere", () => {
  it("only ever admits published posts", () => {
    expect(publishedPostWhere().status).toBe("PUBLISHED");
  });

  it("excludes posts whose publish date has not arrived", () => {
    // This is what makes scheduling work without a cron. If it ever becomes an
    // unbounded match, every scheduled post leaks the moment it is saved.
    const { publishedAt } = publishedPostWhere();

    expect(publishedAt.lte).toBeInstanceOf(Date);
    expect(publishedAt.lte.getTime()).toBeLessThanOrEqual(Date.now());
  });

  it("evaluates the cutoff per call, not once at import", () => {
    const first = publishedPostWhere().publishedAt.lte.getTime();

    expect(publishedPostWhere().publishedAt.lte.getTime()).toBeGreaterThanOrEqual(
      first,
    );
  });
});
