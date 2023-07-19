import {
  ActiveTabMessage,
  GenerateResponseMessage,
  GetOFSettingsMessage,
  SaveOFSettingsMessage,
  UserInfoMessage,
  UserSettingsMessage,
} from "./messages";
import {
  ActiveTabResponse,
  GenerateResponseResponse,
  GetOFSettingsResponse,
  SaveOFSettingsResponse,
  UserInfoResponse,
  UserSettingsResponse,
} from "./responses";

export type MessagesByKind = {
  USER_INFO: UserInfoMessage;
  USER_SETTINGS: UserSettingsMessage;
  ACTIVE_TAB: ActiveTabMessage;
  GENERATE_RESPONSE: GenerateResponseMessage;
  GET_OF_SETTINGS: GetOFSettingsMessage;
  SAVE_OF_SETTINGS: SaveOFSettingsMessage;
};

export type ResponsesByKind = {
  USER_INFO: UserInfoResponse;
  USER_SETTINGS: UserSettingsResponse;
  ACTIVE_TAB: ActiveTabResponse;
  GENERATE_RESPONSE: GenerateResponseResponse;
  GET_OF_SETTINGS: GetOFSettingsResponse;
  SAVE_OF_SETTINGS: SaveOFSettingsResponse;
};
