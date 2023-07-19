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

export interface UserSettingsMessage extends BaseMessage {
  kind: "USER_SETTINGS";
}

export interface ActiveTabMessage extends BaseMessage {
  kind: "ACTIVE_TAB";
}

export interface GenerateResponseMessage extends BaseMessage {
  kind: "GENERATE_RESPONSE";
  data: {
    chattingWith: {
      uid: string;
    };
  };
}

export interface GetOFSettingsMessage extends BaseMessage {
  kind: "GET_OF_SETTINGS";
}

export interface SaveOFSettingsMessage extends BaseMessage {
  kind: "SAVE_OF_SETTINGS";
  data: any;
}

export type Message =
  | UserInfoMessage
  | UserSettingsMessage
  | ActiveTabMessage
  | GenerateResponseMessage
  | GetOFSettingsMessage
  | SaveOFSettingsMessage;
