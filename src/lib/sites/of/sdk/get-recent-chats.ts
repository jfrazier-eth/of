import { Result, err, ok } from "neverthrow";

import { parseError } from "@/sites/common/errors/parse-error";
import { RequestError, UnexpectedStatusCodeError } from "@/sites/common/errors/request-errors";

import { Routes } from "..";
import { SessionContext } from "../context";
import { MessageListItem } from "../routes/v2/chats/list/types";

export async function* getRecentChats(
  context: SessionContext
): AsyncGenerator<
  Result<MessageListItem, { e: UnexpectedStatusCodeError | RequestError | Error; attempts: number }>
> {
  let hasNextPage = true;
  let offset = 0;
  let attempts = 0;
  while (hasNextPage) {
    try {
      const response = await Routes.V2.Chats.List.Get.get(context, {
        limit: 10,
        offset,
        order: "recent",
      });

      hasNextPage = response.hasMore && response.list.length > 0;
      offset = response.nextOffset;

      for (const chat of response.list) {
        yield ok(chat);
      }
      attempts = 0;
    } catch (e) {
      attempts += 1;
      yield err({ e: parseError(e).error, attempts });
    }
  }
}
