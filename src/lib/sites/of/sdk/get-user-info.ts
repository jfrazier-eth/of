import { err, ok } from "neverthrow";

import { parseError } from "@/utils/parse-error";

import { Routes } from "..";
import { OF } from "../..";
import { SessionContext } from "../context";

export async function* getUserInfo(session: SessionContext, userIds: string[]) {
  try {
    const chunkSize = 20;
    const chunks = [];
    for (let i = 0; i < userIds.length; i += chunkSize) {
      chunks.push(userIds.slice(i, i + chunkSize));
    }

    console.log(`Getting user info for ${userIds.length} users. ${chunks.length} chunks`);
    for (const chunk of chunks) {
      const response = await Routes.V2.Users.List.getUsers(session, chunk);

      if (response.isErr()) {
        yield err(response.error);
        continue;
      }
      const data = response.value;
      for (const userId of chunk) {
        if (!(userId in response) || !data[userId]) {
          console.log(`User ${userId} not found`);
          return err(new Error(`User ${userId} not found`));
        }
        const userInfo = data[userId];
        const username = userInfo.username;

        const totalSpendResult = await OF.Sdk.getTotalSpent(session, username);
        if (totalSpendResult.isErr()) {
          console.log(`Failed to get total spent for user ${username}`, totalSpendResult.error);
          yield err(totalSpendResult.error);
          continue;
        }

        yield ok({
          userId: userId,
          username,
          name: userInfo.name,
          total: totalSpendResult.value.total,
        });
      }
    }
  } catch (e) {
    yield parseError(e);
  }
}
