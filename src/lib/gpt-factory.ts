import { GPT4All } from "gpt4all-ts-client";

// TODO: Support more model, refer https://github.com/nomic-ai/gpt4all#gpt4all-compatibility-ecosystem
export type SupportedModels =
  | "gpt4all-lora-quantized"
  | "gpt4all-lora-unfiltered-quantized"
  | "ggml-vicuna-13b-4bit-rev1"
  | "ggml-vicuna-7b-4bit-rev1";

export function gptFactory(model?: SupportedModels) {
  if (String(model).includes("gpt4all")) {
    return new GPT4All(model);
  }

  throw new Error(`Unsupported model or model not specified!`);
}
