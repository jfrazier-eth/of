import { pg, pgp, pgQuery } from "@/backend/db/postgres";
import { UserSessionParams } from "@/sites/of/context";
import { err, ok } from "neverthrow";

import { transformOFLogin } from "./pg-transformer";
import { OFLogin } from "./types";

export type SaveLoginParams = UserSessionParams & {
  userId: string;
  createdAt?: OFLogin["createdAt"];
};

export const saveLogin = async (params: SaveLoginParams | { siteUserId: string, userId: string }) => {
  if (!('xbc' in params)) {
    const query = `DELETE FROM of_logins WHERE site_user_id = $1 AND user_id = $2`;
    const values = [params.siteUserId, params.userId];
    const result = await pgQuery<null>(query, values);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(null);
  }

  const login: OFLogin = {
    params: {
      xbc: params.xbc,
      sess: params.sess,
      authId: params.authId,
      authUid: params.authUid,
      userAgent: params.userAgent,
    },
    siteUserId: params.authId,
    userId: params.userId,
    createdAt: params.createdAt ?? Date.now(),
    updatedAt: Date.now(),
  };
  const pgLogin = transformOFLogin(login);

  const columns = Object.keys(pgLogin);
  const columnSet = new pgp.helpers.ColumnSet(columns, {
    table: "of_logins",
  });

  const insert = pgp.helpers.insert(pgLogin, columnSet);
  const excludedColumns = columns.map((col) => `${col} = EXCLUDED.${col}`).join(", ");
  const query = `${insert} ON CONFLICT ON CONSTRAINT of_logins_pkey DO UPDATE SET ${excludedColumns}`;
  const res = await pgQuery(query);
  if (res.isErr()) {
    return err(res.error);
  }
  return ok(null);
};
