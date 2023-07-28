import { Function } from "../functions";
import { ChatMessage, Message } from "../messages";
import { Model } from "../model";

// TODO support functions
export interface ChatCompletionRequest {
  model: Model;
  messages: Message[];

  functions?: Function[];

  /**
   * defaults to 1
   */
  temperature?: number;

  /**
   * defaults to 1
   */
  top_p?: number;

  /**
   * How many chat completion choices to generate for each input message.
   *
   * defaults to 1
   */
  n?: number;

  stream?: boolean;

  /**
   * Up to 4 sequences where the API will stop generating further tokens.
   */
  stop?: string | string[];

  /**
   * defaults to inf
   */
  max_tokens?: number;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
   *
   * defaults to 0
   */
  presence_penalty?: number;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
   *
   * defaults to 0
   */
  frequency_penalty?: number;

  /**
   * Modify the likelihood of specified tokens appearing in the completion.
   * Accepts a json object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.
   */
  logit_bias?: Record<string, number>;

  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse.
   */
  user?: string;
}

export interface Choice {
  finish_reason: "stop" | "length" | "function_call" | "content_filter" | "null";
  index: number;
  message: ChatMessage;
}

export interface Usage {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
}

export interface ChatCompletionResponse {
  choices: Choice[];
  created: number;
  id: string;
  model: string;
  object: string;
  usage: Usage;
}
