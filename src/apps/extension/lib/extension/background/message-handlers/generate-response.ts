import { err, ok } from "neverthrow";

import { generateResponse } from "@/extension/lib/api/generate-response";

import { GenerateResponseMessage } from "../../messages/index";
import { Handler } from "./types";

export const handleGenerateResponseMessage: Handler<GenerateResponseMessage> = async (
  message,
  context
) => {
  const response = await generateResponse(context, {
    withUser: {
      id: message.data.chat.withUser.id,
    },
  });

  if (response.isErr()) {
    return err(response.error);
  }

  return ok({
    kind: "GENERATE_RESPONSE",
    data: {
      message: response.value.message.text,
    },
  });
};
