import { ok } from "neverthrow";

import { parseError } from "@/sites/common/errors/parse-error";

import { Routes } from "..";
import { SessionContext } from "../context";

export const getTotalSpent = async (session: SessionContext, username: string) => {
  try {
    const userInfo = await Routes.V2.Users.user.get(session, username);
    const totalSpend = userInfo.amountSpent.totalSum;
    return ok({ total: totalSpend ?? 0 });
  } catch (e) {
    return parseError(e);
  }
};
