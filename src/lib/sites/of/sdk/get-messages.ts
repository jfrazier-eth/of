import { parseError } from "@/utils/parse-error";
import { err, ok } from "neverthrow";
import { Routes, SessionContext } from "../index";
import { ReceivedMessage } from "../routes/v2/chats/user/messages/types";

export async function getMessages(
  context: SessionContext,
  otherUserId: string,
  options: {
    maxNumMessages: number;
    startAfterMessageId?: string;
  }
) {
  try {
    let maxNumMessages = options.maxNumMessages;
    let startAfterMessageId = options.startAfterMessageId ?? null;
    let hasNextPage = true;

    let messages: ReceivedMessage[] = [];

    while (hasNextPage && messages.length < maxNumMessages) {
      const response = await Routes.V2.Chats.User.Messages.Get.get(context, {
        otherUserId,
        startAfterMessageId: startAfterMessageId,
      });
      if (response.isErr()) {
        return err(response.error);
      }
      const body = response.value;
      hasNextPage = body.hasMore;
      if (hasNextPage) {
        startAfterMessageId = body.list[body.list.length - 1].id.toString();
      }

      messages = [...messages, ...body.list];
    }

    return ok(messages.slice(0, maxNumMessages));
  } catch (err) {
    return parseError(err);
  }
}

export const transformMessages = (creatorId: string, messages: ReceivedMessage[]) => {
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
