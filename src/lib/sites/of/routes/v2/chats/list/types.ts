import { ReceivedMessage } from "../user/messages/types";

export interface GetMessageListOptions {
  limit?: number;
  offset?: number;
  order?: "recent";
  filter?: "unread";
}

export interface MessageListItem {
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

export interface GetMessageListResponseBody {
  hasMore: boolean;
  nextOffset: number;
  list: MessageListItem[];
}
