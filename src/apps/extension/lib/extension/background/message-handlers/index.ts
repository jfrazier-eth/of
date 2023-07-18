import { Context } from "@/lib/api/context";
import { onMessage } from "../../messages/index.js";

import { handleActiveTabMessage } from "./active-tab.js";
import { handleGenerateResponseMessage } from "./generate-response.js";
import { Handler } from "./types.js";
import { handleUserInfoMessage } from "./user-info.js";
import { handleUserSettingsMessage } from "./user-settings.js";
import {
  handleGetOFSettingsMessage,
  handleSaveOFSettingsMessage,
} from "./of-settings.js";

export const MessageHandlers = {
  USER_INFO: handleUserInfoMessage,
  USER_SETTINGS: handleUserSettingsMessage,
  ACTIVE_TAB: handleActiveTabMessage,
  GENERATE_RESPONSE: handleGenerateResponseMessage,
  GET_OF_SETTINGS: handleGetOFSettingsMessage,
  SAVE_OF_SETTINGS: handleSaveOFSettingsMessage,
};

export const registerMessageHandler = (context: Context) => {
  onMessage(async (message, sender, sendResponse) => {
    const handler = MessageHandlers[message.kind] as Handler<typeof message>;
    const response = await handler(message, context);
    sendResponse(response);
  });
};
