import { err, ok } from "neverthrow";

import { parseError } from "@/sites/common/errors/parse-error";

import { Routes } from "..";
import { OF } from "../..";
import { SessionContext } from "../context";

export async function* getUserInfo(session: SessionContext, userIds: string[]) {
  const chunkSize = 20;
  const chunks = [];
  for (let i = 0; i < userIds.length; i += chunkSize) {
    chunks.push(userIds.slice(i, i + chunkSize));
  }

  console.log(`Getting user info for ${userIds.length} users. ${chunks.length} chunks`);
  for (const chunk of chunks) {
    try {
      const response = await Routes.V2.Users.List.getUsers(session, chunk);

      for (const userId of chunk) {
        if (!(userId in response) || !response[userId]) {
          console.log(`User ${userId} not found`);
          return err(new Error(`User ${userId} not found`));
        }
        const userInfo = response[userId];
        const username = userInfo.username;

        const totalSpendResult = await OF.Sdk.getTotalSpent(session, username);
        if (totalSpendResult.isErr()) {
          console.log(`Failed to get total spent for user ${username}`, totalSpendResult.error);
          yield totalSpendResult;
          continue;
        }

        yield ok({
          userId: userId,
          username,
          name: userInfo.name,
          total: totalSpendResult.value.total,
        });
      }
    } catch (e) {
      return parseError(e);
    }
  }
}
