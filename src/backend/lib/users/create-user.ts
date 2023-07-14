import { AccountParams, createAccount } from "../accounts/create-account.js";
import { pg, pgp } from "@/backend/db/postgres.js";
import { User } from "./types.js";
import { uid } from "@/utils/uuid.js";
import { transformUser } from "./pg-transformer.js";

export interface UserParams {
  name: string;
  username: string;
  firebaseAuthId: string;
  account?: AccountParams;
}

export const createUser = async (params: UserParams) => {
  const user: User = {
    id: uid(),
    name: params.name,
    apiKey: uid(),
    username: params.username,
    firebaseAuthId: params.firebaseAuthId,
    createdAt: Date.now(),
  };

  const pgUser = transformUser(user);

  const columnSet = new pgp.helpers.ColumnSet(Object.keys(pgUser), {
    table: "users",
  });
  const insert = pgp.helpers.insert(pgUser, columnSet);

  try {
    await pg.query(insert);
  } catch (err) {
    console.error(`Failed to save user`, err);
    throw err;
  }

  if (params.account) {
    await createAccount(params.account);
  }
};
