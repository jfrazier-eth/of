import { Account, PGAccount } from "./types";

export const transformPGAccount = (pgAccount: PGAccount): Account => {
  return {
    userId: pgAccount.user_id,
    site: pgAccount.site,
    siteUserId: pgAccount.site_user_id,
    createdAt: new Date(pgAccount.created_at).getTime(),
  };
};

export const transformAccount = (account: Account): PGAccount => {
  return {
    user_id: account.userId,
    site: account.site,
    site_user_id: account.siteUserId,
    created_at: new Date(account.createdAt),
  };
};
