import { err, ok } from "neverthrow";

import { OF } from "@/sites/index";
import { SessionContext } from "@/sites/of/context";

import { getChatMostRecentMessageId, saveChatMostRecentMessageId } from "./storage";

interface Config {
  session: SessionContext;
}

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

export const getChats = async (config: Config) => {
  /**
  * we need to get messages since the last message we processed
    1. get the recent chats
      * We get a chat including the most recent message
      * For each new chat
        * Get all new messages
          * We need to know the most recent message id that has been processed
      * Continue until we get to a chat with a message that we have already seen
  */

  console.log(`Getting new chats`);
  const newChatsResponse = await getChatsWithNewMessages(config.session);

  if (newChatsResponse.isOk()) {
    for (const chat of newChatsResponse.value.chats) {
      console.log(`Found chat with user ${chat.withUser.id}`);
    }
  } else {
    console.log(`Failed to get new chats: ${newChatsResponse.error}`);
  }
};
