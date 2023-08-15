import { err, ok } from "neverthrow";

import { pgQueryOneOrNone } from "@/backend/db/postgres";
import { defaultChatCompletionRequestOptions } from "@/lib/open-ai/chat-completion/defaults";
import { clone } from "@/utils/clone";

import { transformPGPromptSettings } from "./pg-transformer";
import { savePromptSettings } from "./save-prompt-settings";
import { PGPromptSettings } from "./types";

export const getPromptSettings = async (promptId: string) => {
  const query = `SELECT * FROM prompt_settings WHERE prompt_id = $1`;
  const values = [promptId];
  const result = await pgQueryOneOrNone<PGPromptSettings>(query, values);

  if (result.isErr()) {
    return err(result.error);
  }

  let promptSettings = result.value;
  if (!promptSettings) {
    const now = new Date();
    const defaultSettings: PGPromptSettings = {
      ...clone(defaultChatCompletionRequestOptions),
      prompt_id: promptId,
      created_at: now,
      updated_at: now,
    };
    promptSettings = defaultSettings;
    const res = await savePromptSettings(transformPGPromptSettings(defaultSettings));
    if (res.isErr()) {
      console.error(`Failed to save default prompt settings for prompt ${promptId}`, res.error);
    }
  }
  return ok(transformPGPromptSettings(promptSettings));
};
