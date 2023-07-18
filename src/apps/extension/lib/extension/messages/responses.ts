import { UserInfo } from "../background/message-handlers/user-info.js";
import { UserSettings } from "../background/message-handlers/user-settings.js";

interface BaseResponse {
  kind: string;
}

export interface UserInfoResponse extends BaseResponse {
  kind: "USER_INFO";
  data: UserInfo;
}

export interface UserSettingsResponse extends BaseResponse {
  kind: "USER_SETTINGS";
  data: UserSettings;
}

export interface ActiveTabResponse extends BaseResponse {
  kind: "ACTIVE_TAB";
  data: {
    id: number;
  } | null;
}

export interface GenerateResponseResponse extends BaseResponse {
  kind: "GENERATE_RESPONSE";
  data: {
    message: string;
  };
}

export interface GetOFSettingsResponse extends BaseResponse {
  kind: "GET_OF_SETTINGS";
  data: any;
}

export interface SaveOFSettingsResponse extends BaseResponse {
  kind: "SAVE_OF_SETTINGS";
  data: any;
}

export type Response =
  | UserInfoResponse
  | UserSettingsResponse
  | ActiveTabResponse
  | GenerateResponseResponse
  | GetOFSettingsResponse
  | SaveOFSettingsResponse;
