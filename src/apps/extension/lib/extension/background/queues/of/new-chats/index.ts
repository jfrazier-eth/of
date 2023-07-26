import { err, ok } from "neverthrow";

import { OF } from "@/sites/index";
import { SessionContext } from "@/sites/of/context";

import { getChatMostRecentMessageId, saveChatMostRecentMessageId } from "./storage";

/**
 *Get chats with new messages ordered from oldest to most recent
 */
export const getChatsWithNewMessages = async (session: SessionContext) => {
  const chats = OF.Sdk.getRecentChats(session);

  const chatsToProcess = [];
  for await (const result of chats) {
    if (result.isErr()) {
      return err(result.error.e);
    }
    const chat = result.value;
    const withUser = chat.withUser.id.toString();
    const lastMessageId = chat.lastMessage.id.toString();
    const mostRecentMessageId = await getChatMostRecentMessageId(session.userId, withUser);

    if (mostRecentMessageId.isErr()) {
      return err(mostRecentMessageId.error);
    }
    if (mostRecentMessageId.value !== lastMessageId) {
      if (chat.lastMessage.fromUser.id.toString() === session.userId) {
        // update chats that the user has already responded to
        await saveChatMostRecentMessageId(session.userId, withUser, lastMessageId);
      } else {
        chatsToProcess.push(chat);
      }
    }
  }
  return ok({
    chats: chatsToProcess.reverse(),
  });
};
