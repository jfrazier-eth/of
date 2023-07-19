import { getSettings, postSettings } from "@/extension/lib/api/settings.js";
import {
  GetOFSettingsMessage,
  SaveOFSettingsMessage,
} from "../../messages/index.js";
import { Handler } from "./types.js";

export interface OFSettings {
  [key: string]: any;
}

export const handleGetOFSettingsMessage: Handler<GetOFSettingsMessage> = async (
  message,
  context
) => {
  const response = await getSettings(context);
  return response;
};

export const handleSaveOFSettingsMessage: Handler<
  SaveOFSettingsMessage
> = async (message, context) => {
  const response = await postSettings(message.data, context);
  return response;
};
