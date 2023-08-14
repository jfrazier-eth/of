import { FullPrompt } from "@/backend/lib/prompts/types";

export type GetPromptsResponseBody = {
  prompts: FullPrompt[];
};

export type PostPromptRequestBody = {
  prompt: FullPrompt;
};
