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

  while (hasNextPage && items.length < maxNumItems) {
    const response = await Routes.V2.Vault.Media.get(context, {
      offset: offset,
    });

    hasNextPage = response.hasMore;

    items = [...items, ...response.list];
    offset = options.offset + items.length;
  }

  if (items.length > maxNumItems) {
    return {
      hasNextPage: true,
      items: items.slice(0, maxNumItems),
      offset: offset - (items.length - maxNumItems),
    };
  }
  return {
    hasNextPage: hasNextPage,
    items: items,
    offset: offset,
  };
}
