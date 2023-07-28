import { ApiError } from "@/sites/common/errors";
import { parseError } from "@/utils/parse-error";
import { Result, err, ok } from "neverthrow";


import { Routes } from "..";
import { SessionContext } from "../context";
import { MessageListItem } from "../routes/v2/chats/list/types";

export async function* getRecentChats(
  context: SessionContext
): AsyncGenerator<
  Result<MessageListItem, { e: ApiError; attempts: number }>
> {
  let attempts = 0;
  try {
    let hasNextPage = true;
    let offset = 0;
    while (hasNextPage) {
      const response = await Routes.V2.Chats.List.Get.get(context, {
        limit: 10,
        offset,
        order: "recent",
      });
      if (response.isErr()) {
        attempts += 1;
        yield err({ e: response.error, attempts });
      } else {
        const data = response.value;
        hasNextPage = data.hasMore && data.list.length > 0;
        offset = data.nextOffset;

        for (const chat of data.list) {
          yield ok(chat);
        }
        attempts = 0;
      }
    }
  }
  catch (err) {
    return parseError(err);
  }
}
