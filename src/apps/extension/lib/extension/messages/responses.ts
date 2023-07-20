import { Auth } from "../../auth/types";
import { LoggedInUser, LoggedOutUser, UserInfo } from "../background/message-handlers/user-info";
import { UserSettings } from "../background/message-handlers/user-settings";

interface BaseResponse {
  kind: string;
}

export interface UserInfoResponse extends BaseResponse {
  kind: "USER_INFO";
  data: UserInfo;
}

export interface ActiveUserInfoResponse extends BaseResponse {
  kind: "ACTIVE_USER_INFO";
  data: (LoggedInUser & { of: { auth: Auth | null } }) | LoggedOutUser;
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

export interface UserOFSettings {
  userId: string;
  autoMessages: boolean;
  welcomeMessageDefault: boolean;
  spendingThreshold: number;
  scripts: string;
  welcomeMessage: string;
  welcomePrice: number;
  ppvPrice1: number;
  ppvPrice2: number;
  selectedImage: string;
  ppvDefault1: string;
  ppvDefault2: string;
}

export interface GetOFSettingsResponse extends BaseResponse {
  kind: "GET_OF_SETTINGS";
  data: UserOFSettings;
}

export interface SaveOFSettingsResponse extends BaseResponse {
  kind: "SAVE_OF_SETTINGS";
  data:
    | {
        success: true;
      }
    | {
        success: false;
        error: string;
      };
}

export type Response =
  | UserInfoResponse
  | ActiveUserInfoResponse
  | UserSettingsResponse
  | ActiveTabResponse
  | GenerateResponseResponse
  | GetOFSettingsResponse
  | SaveOFSettingsResponse;
