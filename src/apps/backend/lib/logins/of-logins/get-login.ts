import { OFLogin, PGOFLogin } from "./types";
import { transformPGOFLogin } from "./pg-transformer";
import { GetLoginParams } from "../get-login";
import { pg } from "@/backend/db/postgres";

export const getLogin = async (
  params: GetLoginParams
): Promise<OFLogin | null> => {
  const query =
    "SELECT * from of_logins WHERE site_user_id = $1 AND user_id = $2";

  const values = [params.siteUserId, params.userId];

  const result = await pg.query<PGOFLogin[]>(query, values);

  console.assert(
    result.length <= 1,
    `Received multiple logins with the same site_user_id and user_id! Query ${query} Values ${values}`
  );

  if (result.length === 1) {
    return transformPGOFLogin(result[0]);
  }
  return null;
};
