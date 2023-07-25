import { ResultAsync, err, ok, okAsync } from "neverthrow";

import { OFSettings } from "@/backend/lib/settings/of/types";
import { Context } from "@/extension/lib/api/context";
import { OF } from "@/sites/index";
import { SessionContext } from "@/sites/of/context";

import { Errors } from "./errors";

type Chat = unknown;
type HasBeenProcessed = (withUserId: string, messageId: string) => ResultAsync<boolean, Errors>;

interface Config {
  session: SessionContext;
  // callbacks: (
  //   context: Context,
  //   session: SessionContext,
  //   settings: OFSettings,
  //   chat: Chat
  // ) => void[];
  // hasChatBeenProcessed: HasBeenProcessed;
}

export const getChatsWithNewMessages = async (
  session: SessionContext,
  hasChatBeenProcessed: HasBeenProcessed
) => {
  const chats = OF.Sdk.getRecentChats(session);

  const chatsToProcess = [];
  for await (const result of chats) {
    if (result.isErr()) {
      return err(result.error.e);
    }
    const chat = result.value;
    const withUser = chat.withUser.id.toString();
    const lastMessageId = chat.lastMessage.id.toString();
    const hasBeenProcessed = await hasChatBeenProcessed(withUser, lastMessageId);

    if (hasBeenProcessed.isOk()) {
      if (hasBeenProcessed.value) {
        return ok({
          chats: chatsToProcess,
        });
      } else {
        chatsToProcess.push(chat);
      }
    } else {
      return err(hasBeenProcessed.error);
    }
  }
  return ok({
    chats: chatsToProcess,
  });
};

export const trigger = async (config: Config) => {
  /**
  * we need to get messages since the last message we processed
    1. get the recent chats
      * We get a chat including the most recent message
      * For each new chat
        * Get all new messages
          * We need to know the most recent message id that has been processed
      * Continue until we get to a chat with a message that we have already seen
  */

  let numChats = 0;
  const hasChatBeenProcessed: HasBeenProcessed = () => {
    numChats += 1;
    if (numChats > 15) {
      return okAsync(true);
    }
    return okAsync(false);
  };
  console.log(`Getting new chats`);
  const newChatsResponse = await getChatsWithNewMessages(config.session, hasChatBeenProcessed);

  if (newChatsResponse.isOk()) {
    for (const chat of newChatsResponse.value.chats) {
      console.log(`Found chat with user ${chat.withUser.id}`);
    }
  } else {
    console.log(`Failed to get new chats: ${newChatsResponse.error}`);
  }
};
