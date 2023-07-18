import { GenerateResponseMessage } from "../../messages/index.js";
import { Handler } from "./types.js";

export const handleGenerateResponseMessage: Handler<
  GenerateResponseMessage
> = async (message, context) => {
  return Promise.resolve({
    kind: "GENERATE_RESPONSE",
    data: {
      message: "Hello, world!",
    },
  });
};
