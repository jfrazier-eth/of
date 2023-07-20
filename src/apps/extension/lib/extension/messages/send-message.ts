import { MessageHandlers } from "../background/message-handlers";
import { Handler } from "../background/message-handlers/types";
import { isBackground } from "../utils/is-background";
import { Message } from "./index";
import { MessagesByKind, ResponsesByKind } from "./mappings";

export const sendMessage = async <T extends Message>(msg: T) => {
  if (!chrome.runtime) {
    throw new Error("No chrome runtime");
  }

  if (isBackground()) {
    const { context } = await import("../background/context");
    type Msg = typeof msg;
    const handler = (MessageHandlers[msg.kind] as unknown) as Handler<Msg>;
    const response = await handler((msg as unknown) as MessagesByKind[Msg["kind"]], context);
    return response;
  } else {
    return await new Promise<ResponsesByKind[T["kind"]]>((resolve, reject) => {
      chrome.runtime.sendMessage(msg, (response) => {
        resolve(response);
      });
    });
  }
};
