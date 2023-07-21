export interface VaultListState {
  id: number;
  type: "posts" | "stories" | "messages" | "stream" | "custom";
  name: string;
  hasMedia: boolean;
  canAddMedia: boolean;
}

export interface VaultMediaItem {
  id: number;
  type: "photo" | "video" | "gif" | "audio";
  convertedToVideo: boolean;
  canView: boolean;
  hasError: boolean;
  createdAt: string;
  counters: { likesCount: number; tipsSumm: number };
  info: {
    source: {
      source: string;
      width: number;
      height: number;
      size: number;
      duration: number;
    };
    preview: { width: number; height: number; size: number };
  };
  source: {
    source: string;
    width: number;
    height: number;
    size: number;
    duration: number;
  };
  squarePreview: string;
  full: string;
  preview: string;
  thumb: string;
  hasPosts: boolean;
  listStates: VaultListState[];
  mentionedUsers: unknown[];
  files: {
    preview: {
      url: string;
    };
  };
}
