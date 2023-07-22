import { Request, Response } from "express";

import { config } from "@/backend/config";
import { AuthLocals } from "@/backend/controllers/user-auth";
import { userSettingsModel } from "@/backend/models/only-fans/user-settings";
import * as OpenAI from "@/lib/open-ai";
import { getClient } from "@/sites/common/client";

import { transformRequest } from "./transform-request";
import { GenerateChatRequestBody, GenerateChatResponseBody } from "./types";

export const post = async (
  req: Request<{}, {}, GenerateChatRequestBody, {}>,
  res: Response<GenerateChatResponseBody, AuthLocals>
) => {
  const { userId } = res.locals;
  const { user, chat } = req.body;
  if (userId !== user.id) {
    return res.sendStatus(400);
  }

  try {
    const client = getClient({
      throwHttpErrors: false,
      responseType: "json",
    });

    const apiKey = config.openAI.apiKey;

    // TODO update settings
    const settings = await userSettingsModel.findOne({ userId: user.id });

    const chatCompletionRequest = transformRequest(
      {
        user,
        chat,
      },
      {
        customScript: settings?.scripts ?? "",
        emojis: settings?.favoriteEmojis ?? "",
      },
      {
        model: "gpt-3.5-turbo",
        temperature: 0.5,
        max_tokens: 200,
      }
    );

    const {
      usage,
      choices,
      created,
      id,
      model,
      object,
    } = await OpenAI.ChatCompletion.generateCompletion(client, apiKey, chatCompletionRequest);

    console.log(usage, choices, created, id, model, object);

    const pricing = OpenAI.MODEL_PRICING[chatCompletionRequest.model];
    const inputCost = pricing.inputPricePer1KTokens * (usage.prompt_tokens / 1000);
    const outputCost = pricing.outputPricePer1KTokens * (usage.completion_tokens / 1000);

    const cost = inputCost + outputCost;
    console.log(`Response Cost: $${cost}`);

    const responseMessage = choices[0].message;

    let message;
    try {
      message = JSON.parse(responseMessage.content).content;
    } catch (err) {
      console.error(`Failed to parse response message: ${err}`);
      message = responseMessage.content;
    }

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
