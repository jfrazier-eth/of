import { config } from "@/backend/config";
import { InternalAuthResponse, PostRequest } from "@/backend/controllers/types";
import { getPrompt } from "@/backend/lib/prompts/get-prompts";
import { getPromptSettings } from "@/backend/lib/prompts/prompt-settings";
import * as OpenAI from "@/lib/open-ai";
import { getClient } from "@/sites/common/client";

import { transformRequest } from "./transform-request";
import { AIChatRequestBody } from "./types";

export const post = async (
  req: PostRequest<AIChatRequestBody>,
  res: InternalAuthResponse<unknown>
) => {
  try {
    const { body } = req;

    const promptResult = await getPrompt("active");
    if (promptResult.isErr()) {
      console.error(promptResult.error);
      return res.sendStatus(500);
    }
    const prompt = promptResult.value[0];
    if (!prompt) {
      console.error(`Failed to get active prompt`);
      return res.sendStatus(500);
    }

    const promptSettingsResult = await getPromptSettings(prompt.id);
    if (promptSettingsResult.isErr()) {
      console.error(promptSettingsResult.error);
      return res.sendStatus(500);
    }
    const promptSettings = promptSettingsResult.value;

    const options: Omit<OpenAI.ChatCompletion.ChatCompletionRequest, "messages"> = {
      model: promptSettings.model,
      temperature: promptSettings.temperature,
      top_p: promptSettings.topP,
      frequency_penalty: promptSettings.frequencyPenalty,
      presence_penalty: promptSettings.presencePenalty,
      max_tokens: promptSettings.maxTokens,
    };
    const chatCompletionRequest = transformRequest(body, prompt, options);

    const client = getClient({
      responseType: "json",
    });
    const apiKey = config.openAI.apiKey;
    const response = await OpenAI.ChatCompletion.generateCompletion(
      client,
      apiKey,
      chatCompletionRequest
    );

    if (response.isErr()) {
      console.error(response.error);
      return res.sendStatus(500);
    }

    const { usage, choices } = response.value;
    const pricing = OpenAI.MODEL_PRICING[chatCompletionRequest.model];
    const inputCost = pricing.inputPricePer1KTokens * (usage.prompt_tokens / 1000);
    const outputCost = pricing.outputPricePer1KTokens * (usage.completion_tokens / 1000);
    const cost = inputCost + outputCost;

    const responseMessage = choices[0].message;
    let message = responseMessage.content;
    return res.status(200).json({
      cost: {
        input: inputCost,
        output: outputCost,
        total: cost,
      },
      message,
    });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
