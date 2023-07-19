import { pg, pgp } from "@/backend/db/postgres";
import { transformOFLogin } from "./pg-transformer";
import { OFLogin } from "./types";

export type SaveLoginParams = {
  xbc: string;
  sess: string;
  authId: string;
  userId: string;
  createdAt?: OFLogin["createdAt"];
};

export const saveLogin = async (params: SaveLoginParams) => {
  const login: OFLogin = {
    params: {
      xbc: params.xbc,
      sess: params.sess,
      authId: params.authId,
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
  const query = `${insert} ON CONFLICT ON CONSTRAINT of_logins_pkey of DO UPDATE SET ${columns}`;
  try {
    await pg.query(query);
  } catch (err) {
    console.error(`Failed to save of login`, err);
    throw err;
  }
};
