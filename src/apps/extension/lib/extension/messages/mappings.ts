import {
  ActiveTabMessage,
  ActiveUserInfoMessage,
  GenerateResponseMessage,
  GetOFDynamicParamsMessage,
  GetOFSettingsMessage,
  GetVaultItemsMessage,
  SaveOFSettingsMessage,
  UpdateOFRevisionMessage,
  UserInfoMessage,
  UserSettingsMessage,
} from "./messages";
import {
  ActiveTabResponse,
  ActiveUserInfoResponse,
  GenerateResponseResponse,
  GetOFDynamicParamsResponse,
  GetOFSettingsResponse,
  GetVaultItemsResponse,
  SaveOFSettingsResponse,
  UpdateOFRevisionResponse,
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
  ACTIVE_USER_INFO: ActiveUserInfoMessage;
  GET_VAULT_ITEMS: GetVaultItemsMessage;
  UPDATE_OF_REVISION: UpdateOFRevisionMessage;
  GET_OF_DYNAMIC_PARAMS: GetOFDynamicParamsMessage;
};

export type ResponsesByKind = {
  USER_INFO: UserInfoResponse;
  USER_SETTINGS: UserSettingsResponse;
  ACTIVE_TAB: ActiveTabResponse;
  GENERATE_RESPONSE: GenerateResponseResponse;
  GET_OF_SETTINGS: GetOFSettingsResponse;
  SAVE_OF_SETTINGS: SaveOFSettingsResponse;
  ACTIVE_USER_INFO: ActiveUserInfoResponse;
  GET_VAULT_ITEMS: GetVaultItemsResponse;
  UPDATE_OF_REVISION: UpdateOFRevisionResponse;
  GET_OF_DYNAMIC_PARAMS: GetOFDynamicParamsResponse;
};
