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
  subscribesSumm: number;
  tipsSumm: number;
  messagesSumm: number;
  postsSumm: number;
  streamsSumm: number;
  totalSumm: number;
  duration: string;
  hasActivePaidSubscriptions: boolean;
  subscribeAt: Date;
  renewedAt: Date;
  subscribes: any[];
}

export interface FanBase {
  id: number;
  name: string;
  subscribedOnData?: SubscribedOnData;
}

export interface FanStatsResponseBody extends FanBase {
  joinDate: Date;
  lastSeen: Date;
}

export interface NewFan extends FanBase {
  username: string;
  lastSeen: Date;
  subscribedOnExpiredNow: boolean;
}

export interface NewFansResponseBody {
  hasMore: boolean;
  offset: number;
  users: NewFan[];
}
