import { Client } from "@/sites/common/client";

import { ChatCompletionRequest, ChatCompletionResponse } from "./types";

const path = "/v1/chat/completions";
export const generateCompletion = async (
  client: Client,
  apiKey: string,
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> => {
  const url = new URL(path, "https://api.openai.com");

  try {
    const response = await client.post<ChatCompletionResponse>(url, {
      json: request,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (response.status === 200) {
      return response.body;
    }
    throw new Error(`Failed to generate completion: ${response.status}`);
  } catch (err) {
    console.error(err);
    throw new Error("Failed to generate completion");
  }
};

export * as Defaults from "./defaults";

export type { ChatCompletionRequest, ChatCompletionResponse } from "./types";
