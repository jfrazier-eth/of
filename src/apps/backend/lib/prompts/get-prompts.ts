import { err, ok } from "neverthrow";

import { pgQuery, pgQueryOne, pgQueryOneOrNone } from "@/backend/db/postgres";

import { tranformPGPrompt, transformPGPromptMessage } from "./pg-transformer";
import { FullPrompt, PGPrompt, PGPromptMessage, Prompt, PromptMessage } from "./types";

interface QueryResponse {
  prompts_id: PGPrompt["id"];
  prompts_created_at: PGPrompt["created_at"];
  prompts_updated_at: PGPrompt["updated_at"];
  prompts_version: PGPrompt["version"];
  prompt_messages_id: PGPromptMessage["id"];
  prompt_messages_prompt_id: PGPromptMessage["prompt_id"];
  prompt_messages_role: PGPromptMessage["role"];
  prompt_messages_message_index: PGPromptMessage["message_index"];
  prompt_messages_message: PGPromptMessage["message"];
  prompt_messages_created_at: PGPromptMessage["created_at"];
  prompt_messages_updated_at: PGPromptMessage["updated_at"];
}

const transform = (rows: QueryResponse[], activePrompt: string): FullPrompt[] => {
  const extractPrompt = (res: QueryResponse): PGPrompt => {
    return {
      id: res["prompts_id"],
      created_at: res["prompts_created_at"],
      updated_at: res["prompts_updated_at"],
      version: res["prompts_version"],
    };
  };
  const extractMessage = (res: QueryResponse): PGPromptMessage => {
    return {
      id: res["prompt_messages_id"],
      prompt_id: res["prompt_messages_prompt_id"],
      role: res["prompt_messages_role"],
      message_index: res["prompt_messages_message_index"],
      message: res["prompt_messages_message"],
      created_at: res["prompt_messages_created_at"],
      updated_at: res["prompt_messages_updated_at"],
    };
  };

  const messagesByPrompt = new Map<string, PromptMessage[]>();
  const prompts = new Map<string, Prompt>();

  for (const row of rows) {
    const id = row.prompt_messages_prompt_id;
    const isActive = activePrompt === id;
    const prompt = tranformPGPrompt(extractPrompt(row), isActive);
    const message = transformPGPromptMessage(extractMessage(row));
    const messages = messagesByPrompt.get(prompt.id) ?? [];
    messages.push(message);
    messagesByPrompt.set(prompt.id, messages);
    prompts.set(prompt.id, prompt);
  }

  const fullPrompts: FullPrompt[] = [];
  for (const [id, prompt] of prompts) {
    const messages = messagesByPrompt.get(id) ?? [];
    fullPrompts.push({
      ...prompt,
      messages,
    });
  }

  return fullPrompts;
};

export const getActivePromptId = async () => {
  const query = `SELECT * from active_prompt LIMIT 1`;

  const activePrompt = await pgQueryOneOrNone<{ prompt_id: string }>(query);
  if (activePrompt.isErr()) {
    return err(activePrompt.error);
  }

  return ok(activePrompt.value?.prompt_id ?? "");
};

export const getPrompts = async () => {
  const activePrompt = await getActivePromptId();
  if (activePrompt.isErr()) {
    return err(activePrompt.error);
  }
  const query = `SELECT prompts.id as prompts_id, prompts.created_at as prompts_created_at, prompts.updated_at as prompts_updated_at, prompts.version as prompts_version, prompt_messages.id as prompt_messages_id, prompt_messages.prompt_id as prompt_messages_prompt_id, prompt_messages.role as prompt_messages_role, prompt_messages.message_index as prompt_messages_message_index, prompt_messages.message as prompt_messages_message, prompt_messages.created_at as prompt_messages_created_at, prompt_messages.updated_at as prompt_messages_updated_at FROM prompts JOIN prompt_messages on prompts.id = prompt_messages.prompt_id`;

  const result = await pgQuery<QueryResponse>(query);

  if (result.isErr()) {
    return err(result.error);
  }

  return ok(transform(result.value, activePrompt.value));
};

export const getPrompt = async (promptIdOrActive: "active" | string) => {
  let promptId = promptIdOrActive;
  const activePrompt = await getActivePromptId();
  if (activePrompt.isErr()) {
    return err(activePrompt.error);
  }
  if (promptIdOrActive === "active") {
    promptId = activePrompt.value;
  }
  const query = `SELECT prompts.id as prompts_id, prompts.created_at as prompts_created_at, prompts.updated_at as prompts_updated_at, prompts.version as prompts_version, prompt_messages.id as prompt_messages_id, prompt_messages.prompt_id as prompt_messages_prompt_id, prompt_messages.role as prompt_messages_role, prompt_messages.message_index as prompt_messages_message_index, prompt_messages.message as prompt_messages_message, prompt_messages.created_at as prompt_messages_created_at, prompt_messages.updated_at as prompt_messages_updated_at FROM prompts JOIN prompt_messages on prompts.id = prompt_messages.prompt_id WHERE prompts.id = '${promptId}'`;

  const result = await pgQuery<QueryResponse>(query);

  if (result.isErr()) {
    return err(result.error);
  }

  return ok(transform(result.value, activePrompt.value));
};
