import { pg } from "@/backend/db/postgres";
import { PGOFPPV } from "./types";
import { transformPGOFPPV } from "./pg-transformer";

export const getPPVs = async (options: {
  userId: string;
  siteUserId: string;
  enabled?: boolean;
}) => {
  let query = `SELECT * from of_ppvs WHERE user_id = $1 AND site_user_id = $2`;

  const values = [options.userId, options.siteUserId];
  if (typeof options.enabled === "boolean") {
    query = `${query} AND enabled = $3`;
    values.push(`${options.enabled}`);
  }

  const result = await pg.query<PGOFPPV[]>(query, values);

  return result.map(transformPGOFPPV);
};
