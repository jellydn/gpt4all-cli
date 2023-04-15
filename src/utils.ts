import path from "path";
import fs from "fs";
import prettier from "prettier";

/**
 * Reset the GPT4All data model.
 */
export function reset(nomicDir: string) {
  const files = fs.readdirSync(nomicDir);
  const remainingFiles: string[] = [];
  files.forEach((file) => {
    // remove all the files on ~/.nomic/ except ~/.nomic/gpt4all
    if (file !== "gpt4all" && file !== "gpt4all.exe") {
      fs.rmSync(path.join(nomicDir, file), { recursive: true });
    } else {
      remainingFiles.push(file);
    }
  });

  return remainingFiles;
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
