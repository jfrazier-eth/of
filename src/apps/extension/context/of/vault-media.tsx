import { useState } from "react";

import { MediaType } from "@/backend/lib/user-media/types";
import { ClientUserMedia } from "@/backend/routes/api/users/:userId/sites/:site/users/:siteUserId/settings/types";
import { sendMessage } from "@/extension/lib/extension/messages";
import { VaultMediaItem } from "@/sites/of/routes/v2/vault/media";

const transformVaultMediaItem = (item: VaultMediaItem): ClientUserMedia => {
  let type: MediaType = item.type;
  if (item.convertedToVideo) {
    type = "video";
  }
  return {
    type: type,
    squarePreview: item.squarePreview,
    source: item.source.source,
    mediaCreatedAt: new Date(item.createdAt).getTime(),
    siteMediaId: item.id.toString(),
  };
};

export const useVaultMedia = () => {
  const [hasNextPage, setHasNextPage] = useState(true);
  const [items, setItems] = useState<ClientUserMedia[]>([]);
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
