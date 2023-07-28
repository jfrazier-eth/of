import { parseError } from "@/utils/parse-error";
import { err, ok } from "neverthrow";
import { Routes, SessionContext } from "../index";

export async function getUnreadChats(
  context: SessionContext,
  options: {
    maxNumChats?: number;
  }
) {
  try {
    let hasNextPage = true;
    let offset = 0;

    const otherUserIds = new Set<string>();

    while (hasNextPage) {
      const response = await Routes.V2.Chats.List.Get.get(context, {
        limit: 10,
        offset: offset,
        order: "recent",
        filter: "unread",
      });
      if (response.isErr()) {
        return err(response.error);
      }

      const body = response.value;

      hasNextPage = body.hasMore;
      offset = body.nextOffset;

      for (const message of body.list) {
        const otherUserId = message.withUser.id.toString();
        console.assert(
          context.userId === otherUserId,
          `Expected with user id to be different from authenticated user id! User ${context.userId} With User ${otherUserId}`
        );
        otherUserIds.add(otherUserId);

        if (options.maxNumChats && otherUserIds.size > options.maxNumChats) {
          hasNextPage = false;
          break;
        }
      }
    }

    return ok({
      chats: [...otherUserIds].map((otherUserId) => {
        return { otherUserId };
      }),
    });
  } catch (err) {
    return parseError(err);
  }
}
