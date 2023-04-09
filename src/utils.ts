import path from "path";
import fs from "fs";

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
