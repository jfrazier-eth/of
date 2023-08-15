import { PGPromptSettings, PromptSettings } from "./types";

export const transformPGPromptSettings = (pgPromptSettings: PGPromptSettings): PromptSettings => {
  return {
    model: pgPromptSettings.model,
    temperature: pgPromptSettings.temperature,
    promptId: pgPromptSettings.prompt_id,
    topP: pgPromptSettings.top_p,
    maxTokens: pgPromptSettings.max_tokens,
    presencePenalty: pgPromptSettings.presence_penalty,
    frequencyPenalty: pgPromptSettings.frequency_penalty,
    createdAt: pgPromptSettings.created_at.getTime(),
    updatedAt: pgPromptSettings.updated_at.getTime(),
  };
};

export const transformPromptSettings = (promptSettings: PromptSettings): PGPromptSettings => {
  return {
    model: promptSettings.model,
    temperature: promptSettings.temperature,
    prompt_id: promptSettings.promptId,
    top_p: promptSettings.topP,
    max_tokens: promptSettings.maxTokens,
    presence_penalty: promptSettings.presencePenalty,
    frequency_penalty: promptSettings.frequencyPenalty,
    created_at: new Date(promptSettings.createdAt),
    updated_at: new Date(promptSettings.updatedAt),
  };
};
