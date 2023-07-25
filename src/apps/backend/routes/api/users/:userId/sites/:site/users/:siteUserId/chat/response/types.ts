import { Site } from "@/backend/lib/accounts";

export interface NonViewableMedia {
  id: string;
  type: "gif" | "video" | "photo";
  isViewable: false;
}
export interface ViewableMedia {
  id: string;
  type: "gif" | "video" | "photo";
  isViewable: true;
  src: string;
  preview: string;
}

export type Media = ViewableMedia | NonViewableMedia;

export interface Message {
  id: string;
  createdAt: string;
  fromUser: {
    id: string;
  };
  toUser: {
    id: string;
  };
  text: string;
  media: Media[];

  isOpened: boolean;

  isLiked: boolean;

  isFree: boolean;
  price: number;
  canPurchase: boolean;

  isTip: boolean;
  tipAmount: number;
}

export interface GenerateChatRequestBody {
  user: {
    id: string;
    siteId: string;
    site: Site;
    name: string;
    handle: string;
  };
  chat: {
    withUser: {
      id: string;
      name: string;
      handle: string;
    };
    messages: Message[];
  };
}

export interface GenerateChatResponseBody {
  message: Pick<Message, "text">;
}
