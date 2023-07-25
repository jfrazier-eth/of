import { ResultAsync } from "neverthrow";

import { Storage } from "@/extension/lib/extension/storage";

export const getChatMostRecentMessageId = (
  userId: string,
  withUserId: string
): ResultAsync<string | null, Error> => {
  return ResultAsync.fromPromise(
    Storage.getString(`user:${userId}:chats:${withUserId}:messages:most-recent`),
    () =>
      new Error(
        `Failed to get most recent chat message for user ${userId} and with user ${withUserId}`
      )
  );
};

export const saveChatMostRecentMessageId = (
  userId: string,
  withUserId: string,
  messageId: string
) => {
  return ResultAsync.fromPromise(
    Storage.set({ [`user:${userId}:chats:${withUserId}:messages:most-recent`]: messageId }),
    () =>
      new Error(
        `Failed to save most recent chat message for user ${userId} and with user ${withUserId}`
      )
  );
};
