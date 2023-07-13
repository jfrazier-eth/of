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

export interface FanResponseBody {
  id: number;
  name: string;
  username: string;
}
