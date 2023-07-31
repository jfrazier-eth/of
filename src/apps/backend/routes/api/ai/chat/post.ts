import { InternalAuthResponse, PostRequest } from "@/backend/controllers/types";
import { transformRequest } from "./transform-request";
import { AIChatRequestBody } from "./types";
import * as OpenAI from "@/lib/open-ai";
import { getClient } from "@/sites/common/client";
import { config } from "@/backend/config";

export const post = async (req: PostRequest<AIChatRequestBody>, res: InternalAuthResponse<unknown>) => {
  try {
    const { body } = req;

    const chatCompletionRequest = transformRequest(body);

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
}
