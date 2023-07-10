export interface ViewableMedia extends MediaCommon {
  canView: true;
  src: string;
  preview: string;
  thumb: string;
  squarePreview: string;
  source: {
    source: string;
  };
}

export interface NonViewableMedia extends MediaCommon {
  canView: false;
  src: null;
  preview: null;
  thumb: null;
  source: {
    source: null;
  };
}

export type Media = ViewableMedia | NonViewableMedia;

export interface Message {
  responseType: "message";
  text: string;
  giphyId: null | unknown;
  lockedText: boolean;
  isFree: boolean;
  price: number;
  isMediaReady: boolean;
  mediaCount: number;
  media: Media[];
  previews: number[];
  isTip: boolean;
  isReportedByMe: boolean;
  isCouplePeopleMedia: boolean;
  queueId: number;
  fromUser: { id: number; _view: "s" | string };
  isFromQueue: boolean;
  id: number;
  isOpened: boolean;
  isNew: boolean;
  createdAt: string;
  changedAt: string;
  cancelSeconds: number;
  isLiked: boolean;
  canPurchase: boolean;
  canPurchaseReason: "free" | string;
  canReport: boolean;
  canBePinned: boolean;
  isPinned: boolean;
}

export interface SentMessage extends Message {
  releaseForms: unknown[];
}

export interface ReceivedMessage extends Message {
  canUnsendQueue: boolean;
  unsendSecondsQueue: number;
}

interface MediaCommon {
  id: string;
  canView: boolean;
  type: "gif" | "video" | "photo";
  locked: null | unknown;
  duration: number;
  hasError: boolean;
  videoSources: unknown;
  info: {
    source: { width: number; height: number; size: number };
    preview: { width: number; height: number; size: number };
  };
}
