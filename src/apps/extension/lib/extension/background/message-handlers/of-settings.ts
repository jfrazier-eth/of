import { getOFSettings, postOFSettings } from "@/extension/lib/api/settings";

import { GetOFSettingsMessage, SaveOFSettingsMessage } from "../../messages/index";
import { Handler } from "./types";

export const handleGetOFSettingsMessage: Handler<GetOFSettingsMessage> = async (
  message,
  context
) => {
  try {
    const response = await getOFSettings(context);
    return {
      kind: "GET_OF_SETTINGS",
      data: {
        success: true,
        settings: response,
      },
    };
  } catch (err) {
    return {
      kind: "GET_OF_SETTINGS",
      data: {
        success: false,
        message: err instanceof Error ? err.message : "Failed to get settings",
      },
    };
  }
};

export const handleSaveOFSettingsMessage: Handler<SaveOFSettingsMessage> = async (
  message,
  context
) => {
  const response = await postOFSettings(message.data, context);
  return {
    kind: "SAVE_OF_SETTINGS",
    data: response,
  };
};
