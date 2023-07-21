import { UserOFSettings } from "./responses";

interface BaseMessage {
  kind: string;
}

export interface UserInfoMessage extends BaseMessage {
  kind: "USER_INFO";
  data: {
    uid: string;
    tokenId?: string;
  };
}

export interface ActiveUserInfoMessage extends BaseMessage {
  kind: "ACTIVE_USER_INFO";
}

export interface UserSettingsMessage extends BaseMessage {
  kind: "USER_SETTINGS";
}

export interface ActiveTabMessage extends BaseMessage {
  kind: "ACTIVE_TAB";
}

export interface GenerateResponseMessage extends BaseMessage {
  kind: "GENERATE_RESPONSE";
  data: {
    chat: {
      withUser: {
        id: string;
      };
    };
  };
}

export interface GetOFSettingsMessage extends BaseMessage {
  kind: "GET_OF_SETTINGS";
}

export interface SaveOFSettingsMessage extends BaseMessage {
  kind: "SAVE_OF_SETTINGS";
  data: UserOFSettings;
}

export interface GetVaultItemsMessage extends BaseMessage {
  kind: "GET_VAULT_ITEMS";
  data: {
    offset: number;
  };
}

export type Message =
  | UserInfoMessage
  | ActiveUserInfoMessage
  | UserSettingsMessage
  | ActiveTabMessage
  | GenerateResponseMessage
  | GetOFSettingsMessage
  | SaveOFSettingsMessage
  | GetVaultItemsMessage;
