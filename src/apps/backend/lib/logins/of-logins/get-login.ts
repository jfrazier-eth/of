import { Result } from "neverthrow";

import { PGError, pg, pgQueryOneOrNone } from "@/backend/db/postgres";

import { GetLoginParams } from "../get-login";
import { transformPGOFLogin } from "./pg-transformer";
import { OFLogin, PGOFLogin } from "./types";

export const getLogin = async (
  params: GetLoginParams
): Promise<Result<OFLogin | null, PGError>> => {
  const query = "SELECT * from of_logins WHERE site_user_id = $1 AND user_id = $2";

  const values = [params.siteUserId, params.userId];

  const result = await pgQueryOneOrNone<PGOFLogin>(query, values);
  return result.map((login) => {
    if (login == null) {
      return login;
    }
    return transformPGOFLogin(login);
  });
};
