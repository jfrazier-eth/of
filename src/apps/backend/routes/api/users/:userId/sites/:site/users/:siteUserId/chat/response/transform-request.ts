import { AIChatRequestBody } from "@/backend/routes/api/ai/chat/types";
import { GenerateChatRequestBody } from "./types";

export const transformRequest = (
  request: GenerateChatRequestBody,
  settings: {
    customScript?: string;
    emojis?: string;
  },
): AIChatRequestBody => {

  const { user, chat, isPPV } = request;

  const messages = chat.messages.map((message) => ({
    fromUserId: message.fromUser.id,
    content: message.text,
  }));

  const customScript = settings.customScript || "";
  const emojis = settings.emojis || "";

  return {
    user: {
      id: user.siteId,
      name: user.name,
    },
    withUser: {
      id: chat.withUser.id,
      name: chat.withUser.name,
    },
    messages,
    customScript,
    emojis,
    isPPV: isPPV
  };
};
