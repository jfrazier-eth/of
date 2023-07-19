import { GenerateResponseMessage } from "../../messages/index";
import { Handler } from "./types";

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
