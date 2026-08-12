import { describe, expect, it } from "vitest";

import { formatFileSize, humanizeEnum } from "./format";

describe("humanizeEnum", () => {
  it("capitalizes a single word", () => {
    expect(humanizeEnum("assignment")).toBe("Assignment");
  });

  it("splits and lowercases subsequent words", () => {
    expect(humanizeEnum("in_progress")).toBe("In progress");
  });

  it("handles already-uppercase backend enum values", () => {
    expect(humanizeEnum("LECTURE_NOTE")).toBe("Lecture note");
  });
});

describe("formatFileSize", () => {
  it("formats bytes under 1KB as bytes", () => {
    expect(formatFileSize(512)).toBe("512 B");
  });

  it("formats kilobytes", () => {
    expect(formatFileSize(2048)).toBe("2.0 KB");
  });

  it("formats megabytes", () => {
    expect(formatFileSize(10 * 1024 * 1024)).toBe("10.0 MB");
  });
});
