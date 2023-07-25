import { err, ok } from "neverthrow";
import PQueue from "p-queue";

import { parseError } from "@/sites/common/errors/parse-error";
import { OF } from "@/sites/index";
import { SessionContext } from "@/sites/of/context";

export const messagingQueue = new PQueue({ concurrency: 1, interval: 1000, intervalCap: 1 });

export async function* getUserInfo(session: SessionContext, userIds: string[]) {
  const chunkSize = 20;
  const chunks = [];
  for (let i = 0; i < userIds.length; i += chunkSize) {
    chunks.push(userIds.slice(i, i + chunkSize));
  }

  console.log(`Getting user info for ${userIds.length} users. ${chunks.length} chunks`);
  for (const chunk of chunks) {
    try {
      const response = await OF.Routes.V2.Users.List.getUsers(session, chunk);

      for (const userId of chunk) {
        if (!(userId in response) || !response[userId]) {
          console.log(`User ${userId} not found`);
          return err(new Error(`User ${userId} not found`));
        }
        const userInfo = response[userId];
        const username = userInfo.username;

        const totalSpendResult = await getTotalSpent(session, username);
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

export const getTotalSpent = async (session: SessionContext, username: string) => {
  try {
    const userInfo = await OF.Routes.V2.Users.user.get(session, username);
    const totalSpend = userInfo.amountSpent.totalSum;
    return ok({ total: totalSpend ?? 0 });
  } catch (e) {
    return parseError(e);
  }
};

export const sendOFMessage = async (
  session: SessionContext,
  message: { toUserId: string; text: string }
) => {
  try {
    const res = await OF.Routes.V2.Chats.User.Messages.Post.post(session, {
      toUserId: message.toUserId,
      text: message.text,
      lockedText: false,
      mediaFiles: [],
      price: 0,
      previews: [],
      isCouplePeopleMedia: false,
      isForward: false,
    });
    const id = res.id.toString();

    return ok({ id });
  } catch (e) {
    return parseError(e);
  }
};
