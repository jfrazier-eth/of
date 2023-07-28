import { parseError } from "@/utils/parse-error";
import { err, ok } from "neverthrow";
import { Routes, SessionContext } from "../index";
import { VaultMediaItem } from "../routes/v2/vault/media/types";

export async function getVault(
  context: SessionContext,
  options: {
    offset: number;
    maxNumItems?: number;
  }
) {
  let maxNumItems = options.maxNumItems ?? 24;
  let offset = options.offset ?? null;
  let hasNextPage = true;

  let items: VaultMediaItem[] = [];
  try {
    while (hasNextPage && items.length < maxNumItems) {
      const response = await Routes.V2.Vault.Media.get(context, {
        offset: offset,
      });

      if (response.isErr()) {
        return err(response.error);
      }
      const body = response.value;

      hasNextPage = body.hasMore;

      items = [...items, ...body.list];
      offset = options.offset + items.length;
    }

    if (items.length > maxNumItems) {
      return ok({
        hasNextPage: true,
        items: items.slice(0, maxNumItems),
        offset: offset - (items.length - maxNumItems),
      });
    }
    return ok({
      hasNextPage: hasNextPage,
      items: items,
      offset: offset,
    });
  } catch (err) {
    return parseError(err);
  }
}
