import { pg, pgp } from "@/backend/db/postgres.js";
import { transformOFSettings } from "./pg-transformer.js";
import { OFSettings } from "./types.js";

export type SaveOFSettingsParams = Pick<
  OFSettings,
  "userId" | "siteUserId" | "settings" | "updatedAt"
> & { createdAt?: OFSettings["createdAt"] };

export const saveSettings = async (params: SaveOFSettingsParams) => {
  const now = Date.now();
  const pgSettings = transformOFSettings({
    ...params,
    createdAt: params.createdAt ?? now,
    updatedAt: now,
  });

  const columns = Object.keys(pgSettings);
  const columnSet = new pgp.helpers.ColumnSet(columns, {
    table: "of_settings",
  });

  const insert = pgp.helpers.insert(pgSettings, columnSet);
  const query = `${insert} ON CONFLICT (site_user_id) of DO UPDATE SET ${columns}`;
  try {
    await pg.query(query);
  } catch (err) {
    console.error(`Failed to save of settings`, err);
    throw err;
  }
};
