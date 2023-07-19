import { onMessage } from "../../messages/index";

import { handleActiveTabMessage } from "./active-tab";
import { handleGenerateResponseMessage } from "./generate-response";
import { Handler } from "./types";
import { handleUserInfoMessage } from "./user-info";
import { handleUserSettingsMessage } from "./user-settings";
import {
  handleGetOFSettingsMessage,
  handleSaveOFSettingsMessage,
} from "./of-settings";
import { Context } from "@/extension/lib/api/context";

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
