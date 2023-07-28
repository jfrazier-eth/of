import { config } from "@/backend/config";
import { PostRequest, UserSiteAuthResponse } from "@/backend/controllers/types";
import { getSettings } from "@/backend/lib/settings/of";
import { OFSettings } from "@/backend/lib/settings/of/types";
import * as OpenAI from "@/lib/open-ai";
import { getClient } from "@/sites/common/client";
import { parseError } from "@/utils/parse-error";
import { err, ok } from "neverthrow";

import { transformRequest } from "./transform-request";
import { GenerateChatRequestBody, GenerateChatResponseBody } from "./types";

export const generateResponse = async (settings: OFSettings, data: GenerateChatRequestBody) => {
  try {
    const client = getClient({
      responseType: "json",
    });

    const apiKey = config.openAI.apiKey;
    const chatCompletionRequest = transformRequest(
      {
        user: data.user,
        chat: data.chat,
        isPPV: data.isPPV,
      },
      {
        customScript: settings.settings.generativeMessaging.script,
        emojis: settings.settings.generativeMessaging.emojis,
      },
      {
        model: "gpt-3.5-turbo",
        temperature: 0.9,
        max_tokens: 200,
      }
    );

    const response = await OpenAI.ChatCompletion.generateCompletion(
      client,
      apiKey,
      chatCompletionRequest
    );

    if (response.isErr()) {
      return err(response.error);
    }

    const { usage, choices } = response.value;

    const pricing = OpenAI.MODEL_PRICING[chatCompletionRequest.model];
    const inputCost = pricing.inputPricePer1KTokens * (usage.prompt_tokens / 1000);
    const outputCost = pricing.outputPricePer1KTokens * (usage.completion_tokens / 1000);

    const cost = inputCost + outputCost;

    const responseMessage = choices[0].message;

    let message: string;
    try {
      message = JSON.parse(responseMessage.content).content;
    } catch (err) {
      console.error(`Failed to parse response message: ${err}`);
      message = responseMessage.content;
    }
    return ok({
      cost: {
        input: inputCost,
        output: outputCost,
        total: cost,
      },
      message,
    });
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
      console.error('Failed to generate response', response.error);
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
