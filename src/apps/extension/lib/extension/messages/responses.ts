import { OFSettings } from "@/backend/lib/settings/of/types";
import { ClientOFDynamicParams } from "@/backend/routes/api/users/:userId/sites/:site/users/:siteUserId/sign/params/types";
import { VaultMediaItem } from "@/sites/of/routes/v2/vault/media";

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

export interface GetVaultItemsResponse extends BaseResponse {
  kind: "GET_VAULT_ITEMS";
  data:
    | {
        items: VaultMediaItem[];
        hasNextPage: boolean;
        offset: number;
      }
    | { error: string };
}

export interface GetOFSettingsResponse extends BaseResponse {
  kind: "GET_OF_SETTINGS";
  data: OFSettings;
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

export interface UpdateOFRevisionResponse extends BaseResponse {
  kind: "UPDATE_OF_REVISION";
  data:
    | {
        success: true;
        revision: string;
      }
    | {
        success: false;
        message: string;
      };
}

export interface GetOFDynamicParamsResponse extends BaseResponse {
  kind: "GET_OF_DYNAMIC_PARAMS";
  data:
    | {
        success: true;
        params: ClientOFDynamicParams;
      }
    | {
        success: false;
        message: string;
      };
}

export type Response =
  | UserInfoResponse
  | ActiveUserInfoResponse
  | UserSettingsResponse
  | ActiveTabResponse
  | GenerateResponseResponse
  | GetOFSettingsResponse
  | SaveOFSettingsResponse
  | GetVaultItemsResponse
  | UpdateOFRevisionResponse
  | GetOFDynamicParamsResponse;
