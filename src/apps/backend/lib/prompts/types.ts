export interface PGPrompt {
  id: string;
  created_at: Date;
  updated_at: Date;
  version: number;
}

export interface Prompt {
  id: string;
  createdAt: number;
  updatedAt: number;
  isActive: boolean;
  version: number;
}

export interface PGPromptMessage {
  id: string;
  prompt_id: string;
  role: "user" | "system" | "assistant";
  message_index: number;
  message: string;
  created_at: Date;
  updated_at: Date;
}

export interface PromptMessage {
  id: string;
  promptId: string;
  role: "user" | "system" | "assistant";
  messageIndex: number;
  message: string;
  createdAt: number;
  updatedAt: number;
}

export interface FullPrompt extends Prompt {
  messages: PromptMessage[];
}
