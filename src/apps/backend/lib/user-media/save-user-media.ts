import { pg, pgp } from "@/backend/db/postgres";

import { transformUserMedia } from "./pg-transformer";
import { PGUserMedia, UserMedia } from "./types";

export const savePGUserMedia = async (pgMedia: PGUserMedia | null) => {
  if (pgMedia) {
    const columns = Object.keys(pgMedia);
    const columnSet = new pgp.helpers.ColumnSet(columns, {
      table: "user_media",
    });

    const insert = pgp.helpers.insert(pgMedia, columnSet);
    const excludedColumns = columns.map((col) => `${col} = EXCLUDED.${col}`).join(", ");
    const query = `${insert} ON CONFLICT (id) of DO UPDATE SET ${excludedColumns}`;
    try {
      await pg.query(query);
    } catch (err) {
      console.error(`Failed to save user media`, err);
      throw err;
    }
  }
};

export const saveUserMedia = async (media: UserMedia | null) => {
  const pgMedia = transformUserMedia(media);
  await savePGUserMedia(pgMedia);
};
