import { pg, pgp } from "@/backend/db/postgres";

import { transformAccount } from "./pg-transformer";
import { Account, PGAccount } from "./types";

export type AccountParams = Pick<Account, "userId" | "site" | "siteUserId">;

export const createAccount = async (params: AccountParams) => {
  const account: Account = {
    userId: params.userId,
    site: params.site,
    siteUserId: params.siteUserId,
    createdAt: Date.now(),
  };

  const pgAccount: PGAccount = transformAccount(account);

  const columnSet = new pgp.helpers.ColumnSet(Object.keys(pgAccount), {
    table: "accounts",
  });

  const insert = pgp.helpers.insert(pgAccount, columnSet);

  try {
    await pg.query(insert);
  } catch (err) {
    console.error(`Failed to save account`, err);
    throw err;
  }
};
