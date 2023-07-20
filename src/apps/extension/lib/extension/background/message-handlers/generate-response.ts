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

  return {
    kind: "GENERATE_RESPONSE",
    data: {
      message: response.message.text,
    },
  };
};
