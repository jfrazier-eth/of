import { useState } from "react";

import { sendMessage } from "@/extension/lib/extension/messages";
import { UserMedia } from "@/extension/lib/extension/messages/responses";
import { VaultMediaItem } from "@/sites/of/routes/v2/vault/media";

const transformVaultMediaItem = (item: VaultMediaItem): UserMedia => {
  let type = item.type;
  if (item.convertedToVideo) {
    type = "video";
  }
  return {
    id: item.id.toString(),
    type: type,
    squarePreview: item.squarePreview,
    source: item.source.source,
    createdAt: new Date(item.createdAt).getTime(),
  };
};

export const useVaultMedia = () => {
  const [hasNextPage, setHasNextPage] = useState(true);
  const [items, setItems] = useState<UserMedia[]>([]);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const fetchNextPage = async () => {
    setIsFetchingNextPage(true);
    try {
      const { data } = await sendMessage({
        kind: "GET_VAULT_ITEMS",
        data: {
          offset: items.length,
        },
      });
      if ("error" in data) {
        throw new Error(data.error);
      }

      const userMediaItems = data.items.map(transformVaultMediaItem);

      setItems((prev) => [...prev, ...userMediaItems]);
      setHasNextPage(data.hasNextPage);
      setIsFetchingNextPage(false);
    } catch (err) {
      console.error(err);
      setIsFetchingNextPage(false);
    }
  };

  return {
    hasNextPage,
    items,
    fetchNextPage,
    isFetchingNextPage,
  };
};
