import { beforeEach, describe, it, expect, vi } from "vitest";
import { reset, formatCodeBlocks } from "./utils.js";
import { fromAny } from "@total-typescript/shoehorn";

import fs from "fs";
import path from "path";

vi.mock("fs");

describe("reset", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should remove all files except gpt4all and gpt4all.exe", () => {
    const files = ["file1", "gpt4all", "file2", "gpt4all.exe"];
    vi.spyOn(fs, "readdirSync").mockReturnValue(fromAny(files));

    const remainingFiles = reset("/path/to/nomic/dir");

    expect(fs.readdirSync).toHaveBeenCalledWith("/path/to/nomic/dir");
    expect(fs.rmSync).toHaveBeenCalledWith(
      path.join("/path/to/nomic/dir", "file1"),
      { recursive: true }
    );
    expect(fs.rmSync).toHaveBeenCalledWith(
      path.join("/path/to/nomic/dir", "file2"),
      { recursive: true }
    );
    expect(fs.rmSync).toHaveBeenCalledTimes(2);

    expect(remainingFiles).toEqual(["gpt4all", "gpt4all.exe"]);
  });
});

describe("formatCodeBlocks", () => {
  it("should format code blocks in markdown", () => {
    const input =
      "Some text\n\n```javascript\nconsole.log('hello world');\n```\n\nMore text";
    const expectedOutput =
      'Some text\n\n```javascript\nconsole.log("hello world");\n```\n\nMore text\n';
    expect(formatCodeBlocks(input)).toEqual(expectedOutput);
    expect(formatCodeBlocks(input)).toMatchSnapshot();
  });

  it("should not format text without code blocks", () => {
    const input = "Some text without code blocks";
    expect(formatCodeBlocks(input)).toEqual(input);
    expect(formatCodeBlocks(input)).toMatchSnapshot();
  });

  it("should format code blocks with different languages", () => {
    const input = "```typescript\nconst x: number = 42;\n```";
    const expectedOutput = "```typescript\nconst x: number = 42;\n```\n";
    expect(formatCodeBlocks(input)).toEqual(expectedOutput);
    expect(formatCodeBlocks(input)).toMatchSnapshot();
  });

  it("should format code blocks with options", () => {
    const input = "```javascript\nconst x = [1,2,3];\n```\n";
    const expectedOutput = "```javascript\nconst x = [1, 2, 3];\n```\n";
    expect(formatCodeBlocks(input)).toEqual(expectedOutput);
    expect(formatCodeBlocks(input)).toMatchSnapshot();
  });

  it("should format code blocks with trailing whitespace", () => {
    const input = "```javascript\nconst x = [1,2,3];\n  \n```";
    const expectedOutput = "```javascript\nconst x = [1, 2, 3];\n```\n";
    expect(formatCodeBlocks(input)).toEqual(expectedOutput);

    expect(formatCodeBlocks(input)).toMatchSnapshot();
  });

  it("should format code blocks with leading whitespace", () => {
    const input = "  ```javascript\n  const x = [1,2,3];\n  ```";
    const expectedOutput = "```javascript\nconst x = [1, 2, 3];\n```\n";
    expect(formatCodeBlocks(input)).toEqual(expectedOutput);
    expect(formatCodeBlocks(input)).toMatchSnapshot();
  });

  it("should format code blocks with inline code", () => {
    const input = "```javascript\nconst x = `hello ${name}`;\n```\n";
    const expectedOutput = "```javascript\nconst x = `hello ${name}`;\n```\n";
    expect(formatCodeBlocks(input)).toEqual(expectedOutput);
    expect(formatCodeBlocks(input)).toMatchSnapshot();
  });
});
