import PQueue from "p-queue";

import { Context } from "@/extension/lib/api/context";
import { parseError } from "@/utils/parse-error";

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

const queues = Object.fromEntries(
  Object.keys(MessageHandlers).map((key) => [
    key,
    new PQueue({ concurrency: 1, intervalCap: 1, interval: 1000 }),
  ])
);

export const registerMessageHandler = (context: Context) => {
  console.log("Registering message handler");
  onMessage(async (message, sender, sendResponse) => {
    const handler = MessageHandlers[message.kind] as Handler<typeof message>;
    await queues[message.kind].add(async () => {
      try {
        const response = await handler(message, context);
        if (response.isOk()) {
          sendResponse(({
            isOk: true,
            value: response.value,
          } as unknown) as any);
        } else {
          console.error(`Failed to handle ${message.kind}`, response.error);
          sendResponse(({
            isOk: false,
            error: response.error?.message,
          } as unknown) as any);
        }
      } catch (err) {
        console.error(`Failed to handle ${message.kind}`, err);
        const e = parseError(err);
        sendResponse(({
          isOk: false,
          error: e.error?.message,
        } as unknown) as any);
      }
    });
  });
};
