import React, { LegacyRef } from "react";

import { Dialog } from "@headlessui/react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { useVaultMedia } from "@/extension/context/of/vault-media";
import { VaultMediaItem } from "@/sites/of/routes/v2/vault/media";

import { AudioMedia } from "./AudioMedia";
import { GifMedia } from "./GifMedia";
import { ImageMedia } from "./ImageMedia";
import { VideoMedia } from "./VideoMedia";

interface MediaGridProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: VaultMediaItem) => void;
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

  const handleSelection = (id: string) => {
    const vaultItem = items.find((item) => item.id.toString() === id);
    if (!vaultItem) {
      console.error(`Failed to find the selected media item`);
    } else {
      onSelect(vaultItem);
    }
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
      className="fixed inset-0 flex items-center justify-center z-10"
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

            const vaultItem = items[virtualRow.index];
            let mediaComponent;

            switch (vaultItem.type) {
              case "photo":
                mediaComponent = <ImageMedia src={vaultItem.squarePreview} />;
                break;
              case "gif":
                if (vaultItem.convertedToVideo) {
                  mediaComponent = (
                    <VideoMedia src={vaultItem.source.source} preview={vaultItem.squarePreview} />
                  );
                } else {
                  mediaComponent = <GifMedia src={vaultItem.squarePreview} />;
                }
                break;
              case "video":
                mediaComponent = (
                  <VideoMedia src={vaultItem.source.source} preview={vaultItem.squarePreview} />
                );
                break;
              case "audio":
                mediaComponent = <AudioMedia src={vaultItem.squarePreview} />;
                break;
            }

            return (
              <div
                key={vaultItem.id.toString()}
                onClick={() => handleSelection(vaultItem.id.toString())}
                className="cursor-pointer transition-colors duration-200 hover:bg-gray-200 rounded h-fit w-fit"
              >
                {mediaComponent}
              </div>
            );
          })}
        </div>
      </div>
    </Dialog>
  );
};
