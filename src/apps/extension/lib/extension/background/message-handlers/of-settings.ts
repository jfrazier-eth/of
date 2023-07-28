import { getOFSettings, postOFSettings } from "@/extension/lib/api/settings";
import { parseError } from "@/utils/parse-error";
import { err, ok } from "neverthrow";

import { GetOFSettingsMessage, SaveOFSettingsMessage } from "../../messages/index";
import { Handler } from "./types";

export const handleGetOFSettingsMessage: Handler<GetOFSettingsMessage> = async (
  message,
  context
) => {
  try {
    const response = await getOFSettings(context);
    if (response.isErr()) {
      return err(response.error);
    }

    const settings = response.value;
    return ok({
      kind: "GET_OF_SETTINGS",
      data: {
        settings: settings,
      },
    });
  } catch (err) {
    return parseError(err);
  }
};

export const handleSaveOFSettingsMessage: Handler<SaveOFSettingsMessage> = async (
  message,
  context
) => {
  const response = await postOFSettings(message.data, context);
  if (response.isErr()) {
    return err(response.error);
  }
  return ok({
    kind: "SAVE_OF_SETTINGS",
  });
};
