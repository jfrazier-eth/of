import { ChatCompletionRequest } from "./types";

export const defaultChatCompletionRequestOptions: Omit<ChatCompletionRequest, "messages"> = {
  model: "gpt-3.5-turbo",
  temperature: 0.5,
  top_p: 1,
  n: 1,
  stream: false,
  max_tokens: 400,
  presence_penalty: 0,
  frequency_penalty: 0,
  logit_bias: {},
};
