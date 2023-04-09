#!/usr/bin/env node

import { GPT4All } from "gpt4all";
import { consola } from "consola";
import ora from "ora";
import { Command } from "commander";
import { version } from "../package.json";
import { join } from "path";
import { homedir } from "os";
import { reset } from "./utils";

// TODO: Support more models (e.g. ggml-vicuna-7b-4bit), refer https://github.com/nomic-ai/gpt4all#gpt4all-compatibility-ecosystem
const program = new Command();
program
  .version(version)
  .description("GPT4all CLI")
  .option(
    "-m, --model <value>",
    "Choose a model (default: gpt4all-lora-quantized)",
    ""
  )
  .option(
    "-r, --reset",
    "Reset the model by deleting the ~/.nomic folder",
    false
  )
  .helpOption("-h, --help", "Display help for command");

program.parse(process.argv);

const main = async (): Promise<void> => {
  consola.info("Welcome to the GPT4all CLI!");

  // Validate model option
  const options = program.opts();

  if (options.reset) {
    const nomicPath = join(homedir(), ".nomic");
    consola.warn(
      `This will delete ${nomicPath} and all its contents except gpt4all file.`
    );
    const confirm = await consola.prompt("Are you sure?", {
      type: "confirm",
    });
    if (confirm) {
      consola.start(`Deleting ${nomicPath} ...`);
      reset(nomicPath);
      consola.success("Reset completed!");
    } else {
      consola.info("Reset cancelled.");
    }

    process.exit(0);
  }

  let model = options.model;
  if (model === "") {
    model = await consola.prompt(
      "Choose a model (default: gpt4all-lora-quantized): ",
      {
        type: "select",
        options: [
          {
            label: "gpt4all-lora-quantized",
            value: "gpt4all-lora-quantized",
            hint: "Default model",
          },
          {
            label: "gpt4all-lora-unfiltered-quantized",
            value: "gpt4all-lora-unfiltered-quantized",
            hint: "Unfiltered model, may contain offensive content",
          },
        ],
      }
    );
  } else if (
    model !== "gpt4all-lora-quantized" &&
    model !== "gpt4all-lora-unfiltered-quantized"
  ) {
    consola.error(`Invalid model option: ${model}`);
    process.exit(1);
  }

  // Instantiate GPT4All with default or custom settings
  const gpt4all = new GPT4All(model, true);
  consola.start(`Initialize and download ${model} model if missing ...`);
  await gpt4all.init();
  await gpt4all.open();
  consola.ready("Model ready!");

  // Get input from user
  let prompt = "";
  while (prompt.toLowerCase() !== "exit" && prompt.toLowerCase() !== "quit") {
    prompt = (await consola.prompt(
      'Enter your prompt (or type "exit" or "quit" to finish): ',
      {
        type: "text",
        default: "exit",
      }
    )) as string;

    if (prompt?.toLowerCase() !== "exit" && prompt?.toLowerCase() !== "quit") {
      // Show a loading spinner while generating the response
      const spinner = ora("Generating response...").start();
      const response = await gpt4all.prompt(prompt);
      spinner.stop();
      consola.warn(response);
    }
  }

  // Close the connection when you're done
  gpt4all.close();
  consola.success("Thank you for using the GPT4all CLI!");
};

main().catch(consola.error);
