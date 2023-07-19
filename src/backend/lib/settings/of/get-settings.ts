import { pg } from "@/backend/db/postgres";
import { OFSettings, PGOFSettings } from "./types";
import { transformPGOFSettings } from "./pg-transformer";

export const getSettings = async (
  siteUserId: string
): Promise<OFSettings | null> => {
  const query = "SELECT * from of_settings WHERE site_user_id = $1";
  const values = [siteUserId];
  const result = await pg.query<PGOFSettings[]>(query, values);
  console.assert(
    result.length <= 1,
    `Received multiple settings with the same site_user_id! Query ${query} Values ${values}`
  );

  if (result.length === 1) {
    return transformPGOFSettings(result[0]);
  }
  return null;
};
