import { useEffect, useState } from "react";

import { sendMessage } from "@/extension/lib/extension/messages";
import { VaultMediaItem } from "@/sites/of/routes/v2/vault/media";

export const useVaultMedia = () => {
  const [hasNextPage, setHasNextPage] = useState(true);
  const [items, setItems] = useState<VaultMediaItem[]>([]);
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

      setItems((prev) => [...prev, ...data.items]);
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
