import { getSettings, postSettings } from "@/extension/lib/api/settings";

import { GetOFSettingsMessage, SaveOFSettingsMessage } from "../../messages/index";
import { Handler } from "./types";

export interface OFSettings {
  [key: string]: any;
}

export const handleGetOFSettingsMessage: Handler<GetOFSettingsMessage> = async (
  message,
  context
) => {
  const response = await getSettings(context);
  return {
    kind: "GET_OF_SETTINGS",
    data: response,
  };
};

export const handleSaveOFSettingsMessage: Handler<SaveOFSettingsMessage> = async (
  message,
  context
) => {
  const response = await postSettings(message.data, context);
  return {
    kind: "SAVE_OF_SETTINGS",
    data: response,
  };
};
