import { Context } from "@/extension/lib/api/context";

import { onMessage } from "../../messages/index";
import { handleActiveTabMessage } from "./active-tab";
import { handleGenerateResponseMessage } from "./generate-response";
import { handleGetVaultItemsMessage } from "./get-vault-items";
import { handleGetOFDynamicParamsMessage, handleUpdateOFRevisionMessage } from "./of-params";
import { handleGetOFSettingsMessage, handleSaveOFSettingsMessage } from "./of-settings";
import { Handler } from "./types";
import { handleActiveUserInfoMessage, handleUserInfoMessage } from "./user-info";
import { handleUserSettingsMessage } from "./user-settings";

export const MessageHandlers = {
  USER_INFO: handleUserInfoMessage,
  USER_SETTINGS: handleUserSettingsMessage,
  ACTIVE_TAB: handleActiveTabMessage,
  GENERATE_RESPONSE: handleGenerateResponseMessage,
  GET_OF_SETTINGS: handleGetOFSettingsMessage,
  SAVE_OF_SETTINGS: handleSaveOFSettingsMessage,
  ACTIVE_USER_INFO: handleActiveUserInfoMessage,
  GET_VAULT_ITEMS: handleGetVaultItemsMessage,
  UPDATE_OF_REVISION: handleUpdateOFRevisionMessage,
  GET_OF_DYNAMIC_PARAMS: handleGetOFDynamicParamsMessage,
};

export const registerMessageHandler = (context: Context) => {
  onMessage(async (message, sender, sendResponse) => {
    const handler = MessageHandlers[message.kind] as Handler<typeof message>;
    const response = await handler(message, context);
    sendResponse(response);
  });
};
