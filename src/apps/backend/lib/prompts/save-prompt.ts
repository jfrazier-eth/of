import { err, ok } from "neverthrow";

import { pgQuery } from "@/backend/db/postgres";
import { pgp } from "@/backend/db/postgres/db";

import { transformFullPrompt } from "./pg-transformer";
import { FullPrompt } from "./types";

export const savePrompt = async (prompt: FullPrompt) => {
  const { prompt: pgPrompt, messages } = transformFullPrompt(prompt);
  if (messages.length === 0) {
    return err(new Error("Must have at least one message"));
  }
  const promptColumns = Object.keys(pgPrompt);
  const promptColumnsSet = new pgp.helpers.ColumnSet(promptColumns, {
    table: "prompts",
  });

  const messageColumns = Object.keys(messages[0]);
  const messageColumnsSet = new pgp.helpers.ColumnSet(messageColumns, {
    table: "prompt_messages",
  });

  const promptExcludedColumns = promptColumns.map((col) => `${col} = EXCLUDED.${col}`).join(", ");
  const promptInsert = `${pgp.helpers.insert(pgPrompt, promptColumnsSet)} ON CONFLICT (id) DO UPDATE SET ${promptExcludedColumns}`;

  const messageExcludedColumns = messageColumns.map((col) => `${col} = EXCLUDED.${col}`).join(", ");
  const messageInsert = `${pgp.helpers.insert(messages, messageColumnsSet)} ON CONFLICT (id) DO UPDATE SET ${messageExcludedColumns}`;

  const query = `${promptInsert}; ${messageInsert}`;
  const result = await pgQuery<null>(query);

  if (result.isErr()) {
    return err(result.error);
  }

  return ok(null);
};
