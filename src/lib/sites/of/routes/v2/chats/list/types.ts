import { ReceivedMessage } from "../user/messages/types";

export interface GetUnreadMessagesOptions {
  limit?: number;
  offset?: number;
  order?: "recent";
  filter?: "unread";
}

export interface UnreadMessage {
  canGoToProfile: boolean;
  canNotSendReason: string;
  canSendMessage: boolean;
  countPinnedMessages: number;
  hasPurchasedFeed: boolean;
  hasUnreadTips: boolean;
  isMutedNotifications: boolean;
  lastReadMessageId: number;
  unreadMessagesCount: number;
  withUser: {
    id: number;
    _view: string;
  };
  lastMessage: ReceivedMessage;
}

export interface GetUnreadMessagesResponseBody {
  hasMore: boolean;
  nextOffset: number;
  list: UnreadMessage[];
}
