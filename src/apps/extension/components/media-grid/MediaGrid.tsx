import React from "react";

import { Dialog } from "@headlessui/react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { ClientUserMedia } from "@/backend/routes/api/users/:userId/sites/:site/users/:siteUserId/settings/types";
import { useVaultMedia } from "@/extension/context/of/vault-media";

import { Media } from "./Media";

interface MediaGridProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: ClientUserMedia) => void;
  title: string;
}

export const MediaGrid: React.FC<MediaGridProps> = ({ open, onClose, onSelect, title }) => {
  const { hasNextPage, items, isFetchingNextPage, fetchNextPage } = useVaultMedia();

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? items.length + 1 : items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  const handleSelection = (item: ClientUserMedia) => {
    onSelect(item);
    onClose();
  };

  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (lastItem.index >= items.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    items.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 flex items-center justify-center z-10 max-h-[80%] max-w-[80%] m-auto"
    >
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-10" />
      <div className="bg-white text-black rounded-lg p-4 max-h-full h-full w-full relative overflow-y-scroll">
        <Dialog.Title className="text-lg font-bold mb-4">{title}</Dialog.Title>
        <div className="grid grid-cols-2 gap-0.5" ref={parentRef}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const isLoaderRow = virtualRow.index === items.length;

            if (isLoaderRow && !hasNextPage) {
              return <div key="media-grid-complete"></div>;
            } else if (isLoaderRow) {
              return <div key="media-grid-loading">Loading more...</div>;
            }

            const item = items[virtualRow.index];
            return (
              <div
                key={item.id}
                onClick={() => handleSelection(item)}
                className="cursor-pointer transition-colors duration-200 hover:bg-gray-200 rounded h-fit w-fit"
              >
                <Media media={item} />
              </div>
            );
          })}
        </div>
      </div>
    </Dialog>
  );
};
