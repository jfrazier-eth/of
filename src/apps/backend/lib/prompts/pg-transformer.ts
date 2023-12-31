import { FullPrompt, PGPrompt, PGPromptMessage, PromptMessage } from "./types";

export const tranformPromptMessage = (prompt: PromptMessage): PGPromptMessage => {
  return {
    id: prompt.id,
    prompt_id: prompt.promptId,
    role: prompt.role,
    message_index: prompt.messageIndex,
    message: prompt.message,
    created_at: new Date(prompt.createdAt),
    updated_at: new Date(prompt.updatedAt),
  };
};

export const transformPGPromptMessage = (prompt: PGPromptMessage): PromptMessage => {
  return {
    id: prompt.id,
    promptId: prompt.prompt_id,
    role: prompt.role,
    messageIndex: prompt.message_index,
    message: prompt.message,
    createdAt: prompt.created_at.getTime(),
    updatedAt: prompt.updated_at.getTime(),
  };
};

export const transformFullPrompt = (
  prompt: FullPrompt
): { prompt: PGPrompt; messages: PGPromptMessage[]; isActive: boolean } => {
  return {
    prompt: {
      id: prompt.id,
      created_at: new Date(prompt.createdAt),
      updated_at: new Date(prompt.updatedAt),
      version: prompt.version,
    },
    messages: prompt.messages.map(tranformPromptMessage),
    isActive: prompt.isActive,
  };
};

export const tranformPGPrompt = (prompt: PGPrompt, isActive: boolean) => {
  return {
    id: prompt.id,
    createdAt: prompt.created_at.getTime(),
    updatedAt: prompt.updated_at.getTime(),
    isActive,
    version: prompt.version,
  };
};
