import { err, ok } from "neverthrow";

import { pgp } from "@/backend/db/postgres/db";
import { pgQuery } from "@/backend/db/postgres/query";

import { transformPromptSettings } from "./pg-transformer";
import { PromptSettings } from "./types";


export const savePromptSettings = async (promptSettings: PromptSettings) => {

  const pgPromptSettings = transformPromptSettings(promptSettings);

  const columns = Object.keys(pgPromptSettings);
  const columnsSet = new pgp.helpers.ColumnSet(columns, { table: "prompt_settings" });
  const excludedColumns = columns.map((col) => `${col} = EXCLUDED.${col} `).join(", ");

  const query = `${pgp.helpers.insert(
    pgPromptSettings,
    columnsSet
  )
    } ON CONFLICT(prompt_id) DO UPDATE SET ${excludedColumns} `;

  const result = await pgQuery(query);

  if (result.isErr()) {
    return err(result.error);
  }

  return ok(null);
};
