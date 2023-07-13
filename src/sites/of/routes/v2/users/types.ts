export interface GetMeResponseBody {
  id: number;
  name: string;
  username: string;
  canReceiveChatMessage: boolean;
  isPerformer: boolean;
  subscribersCount: number;
  subscribesCount: number;
  email: string;
  wsAuthToken: string;
}

export interface GetMeResponse {
  id: string;
  name: string;
  username: string;
  email: string;
  wsAuthToken: string;
}

export interface SubscribedOnData {
  subscribePrice: number;
  subscribesSum: number;
  tipsSum: number;
  messagesSum: number;
  postsSum: number;
  streamsSum: number;
  totalSum: number;
  duration: string;
  hasActivePaidSubscriptions: boolean;
  subscribedAt: Date;
  renewedAt: Date;
}

export interface FanBase {
  id: number;
  name: string;
  subscribedOnData: SubscribedOnData;
}

export interface FanResponseBody extends FanBase {
  username: string;
}

export interface FanStatsResponseBody extends FanBase {
  joinDate: Date;
  lastSeen: Date;
}

export interface NewFan extends FanBase {
  username: string;
  lastSeen: Date;
}

export interface NewFansResponseBody {
  hasMore: boolean;
  offset: number;
  users: NewFan[];
}
