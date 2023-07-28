import { parseError } from "@/utils/parse-error";
import { err, ok } from "neverthrow";

import { Routes } from "..";
import { SessionContext } from "../context";

export const getTotalSpent = async (session: SessionContext, username: string) => {
  try {
    const response = await Routes.V2.Users.user.get(session, username);
    if (response.isErr()) {
      return err(response.error);
    }
    const userInfo = response.value;
    const totalSpend = userInfo.amountSpent.totalSum;
    return ok({ total: totalSpend ?? 0 });
  } catch (e) {
    return parseError(e);
  }
};
