import { Routes, SessionContext } from "../index.js";
import { ReceivedMessage } from "../routes/v2/chats/user/messages/types.js";

export async function getMessages(
  context: SessionContext,
  otherUserId: string,
  options: {
    maxNumMessages: number;
    startAfterMessageId?: string;
  }
) {
  let maxNumMessages = options.maxNumMessages;
  let startAfterMessageId = options.startAfterMessageId ?? null;
  let hasNextPage = true;

  let messages: ReceivedMessage[] = [];

  while (hasNextPage && messages.length < maxNumMessages) {
    const response = await Routes.V2.Chats.User.Messages.Get.get(context, {
      otherUserId,
      startAfterMessageId: startAfterMessageId,
    });
    console.log(response.list.length)

    hasNextPage = response.hasMore;
    if (hasNextPage) {
      startAfterMessageId = response.list[response.list.length - 1].id.toString();
    }


    messages = [...messages, ...response.list];
  }

  return messages.slice(0, maxNumMessages);
}


export const transformMessages = (
  creatorId: string,
  messages: ReceivedMessage[]
) => {
  return messages
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((message) => {
      return {
        role: message.fromUser.id.toString() === creatorId ? "creator" : "fan",
        content: message.text,
        timeOfMsg: message.createdAt,
        mediaSent: message.media.length > 0,
        isTip: message.isTip,
        tipAmount: message.tipAmount || null,
      };
    });
};

