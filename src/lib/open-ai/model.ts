export type Model = "gpt-3.5-turbo" | "gpt-3.5-turbo-16k";

// https://openai.com/pricing#language-models
export const MODEL_PRICING: {
  [key in Model]: {
    inputPricePer1KTokens: number;
    outputPricePer1KTokens: number;
  };
} = {
  "gpt-3.5-turbo": {
    inputPricePer1KTokens: 0.0015,
    outputPricePer1KTokens: 0.002,
  },
  "gpt-3.5-turbo-16k": {
    inputPricePer1KTokens: 0.003,
    outputPricePer1KTokens: 0.004,
  },
};
