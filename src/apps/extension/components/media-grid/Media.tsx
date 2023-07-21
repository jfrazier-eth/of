import { UserMedia } from "@/extension/lib/extension/messages/responses";

import { AudioMedia } from "./AudioMedia";
import { GifMedia } from "./GifMedia";
import { ImageMedia } from "./ImageMedia";
import { VideoMedia } from "./VideoMedia";

export const Media = ({ media }: { media: UserMedia }) => {
  switch (media.type) {
    case "photo":
      return <ImageMedia src={media.squarePreview} />;
    case "gif":
      return <GifMedia src={media.squarePreview} />;

    case "video":
      return <VideoMedia src={media.source} preview={media.squarePreview} />;

    case "audio":
      return <AudioMedia src={media.squarePreview} />;
  }
};
