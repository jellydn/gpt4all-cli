import path from "path";
import fs from "fs";
import prettier from "prettier";

/**
 * Reset the GPT4All data model.
 */
export function reset(nomicDir: string) {
  const files = fs.readdirSync(nomicDir);
  files.forEach((file) => {
    // remove all the files on ~/.nomic/ except ~/.nomic/gpt4all
    if (file !== "gpt4all") {
      fs.rmSync(path.join(nomicDir, file), { recursive: true });
    }
  });
}

/**
 * formatCodeBlocks.
 *
 * @param {string} text
 */
export function formatCodeBlocks(text: string) {
  // only format text if it contains a code block
  if (text.includes("```")) {
    return prettier.format(text, { parser: "markdown" });
  }

  return text;
}
