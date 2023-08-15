import { Model } from "../model";

export const defaultChatCompletionRequestOptions = {
  model: "gpt-3.5-turbo" as Model,
  temperature: 0.7,
  top_p: 1,
  n: 1,
  stream: false,
  max_tokens: 400,
  presence_penalty: 1,
  frequency_penalty: 2,
  logit_bias: {},
};
