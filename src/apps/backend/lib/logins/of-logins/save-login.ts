import { pg, pgp } from "@/backend/db/postgres";
import { UserSessionParams } from "@/sites/of/context";

import { transformOFLogin } from "./pg-transformer";
import { OFLogin } from "./types";

export type SaveLoginParams = UserSessionParams & {
  userId: string;
  createdAt?: OFLogin["createdAt"];
};

export const saveLogin = async (params: SaveLoginParams) => {
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
  try {
    await pg.query(query);
  } catch (err) {
    console.error(`Failed to save of login`, err);
    throw err;
  }
};
