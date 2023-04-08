import { GPT4All } from "gpt4all";
import { consola } from "consola";
import ora from "ora";

const main = async () => {
  consola.info("Welcome to the GPT4all CLI!");

  // Let user choose the model
  const model = await consola.prompt(
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

  // Instantiate GPT4All with default or custom settings
  const gpt4all = new GPT4All(model as any, true);
  consola.start(`Initialize and download ${model} model if missing ...`);
  await gpt4all.init();
  await gpt4all.open();
  consola.ready("Model ready!");

  // Get input from user
  let prompt = "";
  while (prompt.toLowerCase() !== "exit" && prompt.toLowerCase() !== "quit") {
    prompt = await consola.prompt(
      'Enter your prompt (or type "exit" or "quit" to finish): ',
      {
        type: "text",
        default: "exit",
      }
    );

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
