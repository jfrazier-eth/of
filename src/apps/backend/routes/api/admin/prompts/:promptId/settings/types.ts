import { PromptSettings } from "@/backend/lib/prompts/prompt-settings/types";

export type GetPromptSettingsResponseBody = {
  settings: PromptSettings;
};

export type PostPromptSettingsRequestBody = {
  settings: PromptSettings;
};
