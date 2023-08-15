import { Model } from "@/lib/open-ai/model";

export type PGPromptSettings = {
  prompt_id: string;
  model: Model;
  temperature: number;
  top_p: number;
  max_tokens: number;
  presence_penalty: number;
  frequency_penalty: number;
  created_at: Date;
  updated_at: Date;
};

export type PromptSettings = {
  promptId: string;
  model: Model;
  temperature: number;
  topP: number;
  maxTokens: number;
  presencePenalty: number;
  frequencyPenalty: number;
  createdAt: number;
  updatedAt: number;
};
