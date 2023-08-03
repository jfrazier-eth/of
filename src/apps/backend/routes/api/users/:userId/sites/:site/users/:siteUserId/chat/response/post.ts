import { err, ok } from "neverthrow";

import { config } from "@/backend/config";
import { PostRequest, UserSiteAuthResponse } from "@/backend/controllers/types";
import { getSettings } from "@/backend/lib/settings/of";
import { OFSettings } from "@/backend/lib/settings/of/types";
import { AIChatResponseBody } from "@/backend/routes/api/ai/chat/types";
import { getClient } from "@/sites/common/client";
import { parseError } from "@/utils/parse-error";

import { transformRequest } from "./transform-request";
import { GenerateChatRequestBody, GenerateChatResponseBody } from "./types";

export const generateResponse = async (settings: OFSettings, data: GenerateChatRequestBody) => {
  try {
    const chatRequestBody = transformRequest(
      {
        user: data.user,
        chat: data.chat,
        isPPV: data.isPPV,
      },
      {
        customScript: settings.settings.generativeMessaging.script,
        emojis: settings.settings.generativeMessaging.emojis,
      }
    );
    const client = getClient({
      responseType: "json",
    });
    const apiKey = config.server.apiKey;
    const baseUrl = config.server.apiUrl;
    const url = new URL("/api/ai/chat", baseUrl);
    const response = await client.post<AIChatResponseBody>(url, {
      json: chatRequestBody,
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (response.isErr()) {
      return err(response.error);
    }

    const { body } = response.value;

    return ok(body);
  } catch (err) {
    return parseError(err);
  }
};

export const post = async (
  req: PostRequest<GenerateChatRequestBody>,
  res: UserSiteAuthResponse<GenerateChatResponseBody>
) => {
  try {
    const { userId, siteUserId } = res.locals;
    const { user, chat } = req.body;
    if (userId !== user.id) {
      return res.sendStatus(400);
    }

    const settings = await getSettings(userId, siteUserId);
    if (settings.isErr()) {
      return res.sendStatus(500);
    }
    const response = await generateResponse(settings.value, req.body);
    if (response.isErr()) {
      console.error("Failed to generate response", response.error);
      return res.sendStatus(500);
    }

    const message = response.value.message;
    return res.status(200).json({
      message: {
        text: message,
      },
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
