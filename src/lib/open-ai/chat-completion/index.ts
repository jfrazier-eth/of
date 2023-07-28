import { Client } from "@/sites/common/client";
import { ApiError } from "@/sites/common/errors";
import { parseError } from "@/utils/parse-error";
import { err, ok, Result } from "neverthrow";


import { ChatCompletionRequest, ChatCompletionResponse } from "./types";

const path = "/v1/chat/completions";
export const generateCompletion = async (
  client: Client,
  apiKey: string,
  request: ChatCompletionRequest
): Promise<Result<ChatCompletionResponse, ApiError>> => {
  const url = new URL(path, "https://api.openai.com");

  try {
    const response = await client.post<ChatCompletionResponse>(url, {
      json: request,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (response.isOk()) {
      return ok(response.value.body);
    }

    return err(response.error);
  } catch (err) {
    return parseError(err);
  }
};

export * as Defaults from "./defaults";

export type { ChatCompletionRequest, ChatCompletionResponse } from "./types";
